// Selecionando elementos do DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const weatherCondition = document.getElementById('weather-condition');
const tempValue = document.getElementById('temp-value');
const tempRange = document.getElementById('temp-range');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const weatherIcon = document.getElementById('weather-icon');

// Função para buscar dados do backend
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`/api/weather?city=${city}`);
        if (!response.ok) {
            throw new Error('Não foi possível buscar os dados climáticos.');
        }

        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar os dados climáticos. Verifique o nome da cidade e tente novamente.');
    }
}

// Função para atualizar o DOM com os dados
function updateWeatherUI(data) {
    cityName.textContent = data.name;
    weatherCondition.textContent = data.weather[0].description;
    tempValue.textContent = Math.round(data.main.temp);
    tempRange.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;
    windSpeed.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;

    // Mapeamento de ícones
    const weatherCode = data.weather[0].icon; // Ex: "01d"
    const iconClass = getIconClass(weatherCode);
    weatherIcon.className = `wi ${iconClass}`;
}

// Função para mapear códigos de ícones para classes da Weather Icons
function getIconClass(code) {
    const iconMap = {
        "01d": "wi-day-sunny",
        "01n": "wi-night-clear",
        "02d": "wi-day-cloudy",
        "02n": "wi-night-alt-cloudy",
        "03d": "wi-cloud",
        "03n": "wi-cloud",
        "04d": "wi-cloudy",
        "04n": "wi-cloudy",
        "09d": "wi-showers",
        "09n": "wi-night-showers",
        "10d": "wi-day-rain",
        "10n": "wi-night-alt-rain",
        "11d": "wi-thunderstorm",
        "11n": "wi-thunderstorm",
        "13d": "wi-snow",
        "13n": "wi-snow",
        "50d": "wi-fog",
        "50n": "wi-fog"
    };
    return iconMap[code] || "wi-na";
}

// Evento de clique no botão
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Por favor, insira o nome da cidade.');
    }
});
