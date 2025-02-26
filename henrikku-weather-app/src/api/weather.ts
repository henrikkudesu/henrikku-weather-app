const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeather(city: string) {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Cidade não encontrada');

    const data = await response.json();

    console.log('Dados do clima recebidos:', data); // Para debug

    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: getWeatherCondition(
        data.weather[0].main,
        data.wind.speed,
        data.main.temp
      ),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getWeatherCondition(
  weather: string,
  windSpeed: number,
  temperature: number
): 'wind' | 'rain' | 'sun' | 'snow' {
  // Mapeia as condições meteorológicas da OpenWeatherMap para nossas condições
  const weatherLower = weather.toLowerCase();

  // Se possui neve ou está abaixo de -2°C com precipitação (clouds)
  if (
    weatherLower.includes('snow') ||
    (temperature < -2 && weatherLower.includes('clouds'))
  )
    return 'snow';

  // Condições de chuva
  if (
    weatherLower.includes('rain') ||
    weatherLower.includes('drizzle') ||
    weatherLower.includes('thunderstorm')
  )
    return 'rain';

  // Se estiver com vento forte (acima de 5.5 m/s ou aproximadamente 20km/h)
  if (windSpeed > 5.5) return 'wind';

  // Casos como 'Clear', 'Clouds', etc. vão para sol por padrão
  return 'sun';
}
