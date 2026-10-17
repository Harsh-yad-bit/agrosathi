/**
 * Weather service with Zero-API-Key requirement.
 * 1. If OpenWeather API key is set, uses OpenWeather.
 * 2. Otherwise uses Open-Meteo (open, free, no API key needed).
 * 3. If offline/network fails, uses seasonal deterministic farm weather fallback.
 */

export interface WeatherResponse {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    conditions: string;
    icon: string;
    rainProbability: number;
    uvIndex: number;
    pressure: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    dayName: string;
    high: number;
    low: number;
    humidity: number;
    rainProbability: number;
    conditions: string;
    icon: string;
    windSpeed: number;
  }>;
  weatherRisk: {
    level: string;
    score: number;
    reasoning: string;
    reasoningHi: string;
  };
  isDemo: boolean;
}

function calculateWeatherRisk(current: { humidity: number; temperature: number; rainProbability: number }): {
  level: string;
  score: number;
  reasoning: string;
  reasoningHi: string;
} {
  let score = 0;
  const reasons: string[] = [];
  const reasonsHi: string[] = [];

  // Humidity factor
  if (current.humidity > 80) {
    score += 30;
    reasons.push(`Very high humidity (${current.humidity}%) greatly increases fungal risk`);
    reasonsHi.push(`बहुत अधिक आर्द्रता (${current.humidity}%) कवक रोग के खतरे को बहुत बढ़ाती है`);
  } else if (current.humidity > 65) {
    score += 20;
    reasons.push(`High humidity (${current.humidity}%) increases disease risk`);
    reasonsHi.push(`उच्च आर्द्रता (${current.humidity}%) रोग के खतरे को बढ़ाती है`);
  }

  // Temperature factor
  if (current.temperature >= 25 && current.temperature <= 35) {
    score += 15;
    reasons.push(`Temperature (${current.temperature}°C) is in optimal range for fungal growth`);
    reasonsHi.push(`तापमान (${current.temperature}°C) कवक वृद्धि के लिए अनुकूल सीमा में है`);
  }

  // Rain factor
  if (current.rainProbability > 60) {
    score += 25;
    reasons.push(`High rain probability (${current.rainProbability}%) creates moist conditions for disease spread`);
    reasonsHi.push(`बारिश की अधिक संभावना (${current.rainProbability}%) रोग फैलने के लिए नम स्थिति बनाती है`);
  } else if (current.rainProbability > 30) {
    score += 10;
    reasons.push(`Moderate rain expected`);
    reasonsHi.push(`मध्यम बारिश अपेक्षित`);
  }

  let level: string;
  if (score >= 50) level = 'HIGH';
  else if (score >= 25) level = 'MODERATE';
  else level = 'LOW';

  return {
    level,
    score: Math.min(score, 100),
    reasoning: reasons.length ? reasons.join('. ') + '.' : 'Normal weather conditions. Disease risk is low.',
    reasoningHi: reasonsHi.length ? reasonsHi.join('। ') + '।' : 'सामान्य मौसम की स्थिति। रोग का जोखिम कम है।',
  };
}

function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function decodeWmoWeather(code: number): { conditions: string; icon: string } {
  switch (code) {
    case 0:
      return { conditions: 'Clear sky', icon: '01d' };
    case 1:
      return { conditions: 'Mainly clear', icon: '02d' };
    case 2:
      return { conditions: 'Partly cloudy', icon: '03d' };
    case 3:
      return { conditions: 'Overcast', icon: '04d' };
    case 45:
    case 48:
      return { conditions: 'Foggy', icon: '50d' };
    case 51:
    case 53:
    case 55:
      return { conditions: 'Drizzle', icon: '09d' };
    case 61:
    case 63:
    case 65:
      return { conditions: 'Rain', icon: '10d' };
    case 71:
    case 73:
    case 75:
      return { conditions: 'Snow', icon: '13d' };
    case 80:
    case 81:
    case 82:
      return { conditions: 'Rain showers', icon: '09d' };
    case 95:
    case 96:
    case 99:
      return { conditions: 'Thunderstorm', icon: '11d' };
    default:
      return { conditions: 'Pleasant weather', icon: '02d' };
  }
}

// Free Open-Meteo (No API key needed)
async function fetchOpenMeteo(lat: number, lng: number): Promise<WeatherResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
  
  const res = await fetch(url, { headers: { 'Accept': 'application/json' }, next: { revalidate: 900 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo returned status ${res.status}`);
  }
  const data = await res.json();
  const currentRaw = data.current || {};
  const dailyRaw = data.daily || {};

  const wmo = decodeWmoWeather(currentRaw.weather_code ?? 0);
  const current = {
    temperature: Math.round(currentRaw.temperature_2m ?? 28),
    feelsLike: Math.round(currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 29),
    humidity: Math.round(currentRaw.relative_humidity_2m ?? 65),
    windSpeed: Math.round(currentRaw.wind_speed_10m ?? 12),
    windDirection: getWindDirection(currentRaw.wind_direction_10m ?? 90),
    conditions: wmo.conditions,
    icon: wmo.icon,
    rainProbability: Math.round((dailyRaw.precipitation_probability_max?.[0] ?? currentRaw.precipitation > 0 ? 70 : 15)),
    uvIndex: 5,
    pressure: Math.round(currentRaw.surface_pressure ?? 1012),
    visibility: 10,
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dates = dailyRaw.time || [];
  const forecast: WeatherResponse['forecast'] = [];

  for (let i = 1; i < Math.min(dates.length, 6); i++) {
    const dStr = dates[i];
    const dateObj = new Date(dStr);
    const dayWmo = decodeWmoWeather(dailyRaw.weather_code?.[i] ?? 0);
    forecast.push({
      date: dStr,
      dayName: days[dateObj.getDay()] || 'Day',
      high: Math.round(dailyRaw.temperature_2m_max?.[i] ?? 32),
      low: Math.round(dailyRaw.temperature_2m_min?.[i] ?? 20),
      humidity: Math.round(current.humidity + (i % 2 === 0 ? 5 : -5)),
      rainProbability: Math.round(dailyRaw.precipitation_probability_max?.[i] ?? 20),
      conditions: dayWmo.conditions,
      icon: dayWmo.icon,
      windSpeed: Math.round(dailyRaw.wind_speed_10m_max?.[i] ?? 14),
    });
  }

  const weatherRisk = calculateWeatherRisk(current);
  return { current, forecast, weatherRisk, isDemo: false };
}

// Offline fallback
function generateLocalWeather(lat: number, lng: number): WeatherResponse {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const baseTemp = 27 + Math.sin(lat) * 3;
  const current = {
    temperature: Math.round(baseTemp),
    feelsLike: Math.round(baseTemp + 2),
    humidity: 68,
    windSpeed: 11,
    windDirection: 'NE',
    conditions: 'Partly Sunny & Mild',
    icon: '02d',
    rainProbability: 25,
    uvIndex: 6,
    pressure: 1013,
    visibility: 10,
  };

  const forecast: WeatherResponse['forecast'] = [];
  for (let i = 1; i <= 5; i++) {
    const fDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    forecast.push({
      date: fDate.toISOString().split('T')[0],
      dayName: days[fDate.getDay()],
      high: Math.round(baseTemp + 4 + (i % 3)),
      low: Math.round(baseTemp - 6 + (i % 2)),
      humidity: 60 + (i * 2),
      rainProbability: 20 + (i * 5),
      conditions: i % 2 === 0 ? 'Clear & Sunny' : 'Scattered Clouds',
      icon: i % 2 === 0 ? '01d' : '02d',
      windSpeed: 10 + i,
    });
  }

  const weatherRisk = calculateWeatherRisk(current);
  return { current, forecast, weatherRisk, isDemo: true };
}

export async function getWeather(lat: number, lng: number): Promise<WeatherResponse> {
  const openWeatherKey = process.env.OPENWEATHER_API_KEY;

  if (openWeatherKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${openWeatherKey}&units=metric`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return parseOpenWeatherResponse(data);
      }
    } catch (err) {
      console.warn('[WEATHER] OpenWeather call failed, falling back to Open-Meteo:', err);
    }
  }

  // 1. Try free Open-Meteo (No API key required)
  try {
    const data = await fetchOpenMeteo(lat, lng);
    console.log('[WEATHER] Successfully loaded weather via Open-Meteo (Zero API key mode).');
    return data;
  } catch (err) {
    console.warn('[WEATHER] Open-Meteo request failed, using deterministic local weather:', err);
    return generateLocalWeather(lat, lng);
  }
}

function parseOpenWeatherResponse(data: any): WeatherResponse {
  const list = data.list || [];
  const first = list[0] || {};
  const main = first.main || {};
  const weather = (first.weather || [])[0] || {};
  const wind = first.wind || {};

  const current = {
    temperature: Math.round(main.temp ?? 28),
    feelsLike: Math.round(main.feels_like ?? main.temp ?? 28),
    humidity: main.humidity ?? 60,
    windSpeed: Math.round((wind.speed || 0) * 3.6),
    windDirection: getWindDirection(wind.deg || 0),
    conditions: weather.description || 'Clear sky',
    icon: weather.icon || '01d',
    rainProbability: Math.round(((first.pop as number) || 0) * 100),
    uvIndex: 0,
    pressure: main.pressure || 1012,
    visibility: Math.round(((first.visibility as number) || 10000) / 1000),
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dailyMap = new Map<string, { temps: number[]; humidities: number[]; pops: number[]; conditions: string; icon: string; winds: number[] }>();

  for (const item of list.slice(0, 40)) {
    const itemMain = item.main || {};
    const itemWeather = (item.weather || [])[0] || {};
    const itemWind = item.wind || {};
    const dtTxt = item.dt_txt || '';
    const dateStr = dtTxt.split(' ')[0];

    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, { temps: [], humidities: [], pops: [], conditions: itemWeather.description || '', icon: itemWeather.icon || '01d', winds: [] });
    }
    const day = dailyMap.get(dateStr)!;
    day.temps.push(itemMain.temp || 25);
    day.humidities.push(itemMain.humidity || 60);
    day.pops.push(((item.pop as number) || 0) * 100);
    day.winds.push((itemWind.speed || 0) * 3.6);
  }

  const forecast = Array.from(dailyMap.entries()).slice(1, 6).map(([dateStr, day]) => {
    const date = new Date(dateStr);
    return {
      date: dateStr,
      dayName: days[date.getDay()],
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      humidity: Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length),
      rainProbability: Math.round(Math.max(...day.pops)),
      conditions: day.conditions,
      icon: day.icon,
      windSpeed: Math.round(day.winds.reduce((a, b) => a + b, 0) / day.winds.length),
    };
  });

  const weatherRisk = calculateWeatherRisk(current);
  return { current, forecast, weatherRisk, isDemo: false };
}

export { calculateWeatherRisk };
