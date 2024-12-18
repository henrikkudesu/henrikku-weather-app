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

    // Condição climática com correção na junção
    let condition = data.weather[0].description;

    // Ajusta a junção da frase para a condição climática
    if (condition.indexOf(" ") === -1) {  // Se a descrição for uma palavra única
        weatherCondition.textContent = `está ${condition}`;  // Ex: "Está com sol"
    } else {
        weatherCondition.textContent = `está com ${condition}`;  // Ex: "Está nublado"
    }

    tempValue.textContent = Math.round(data.main.temp);
    tempRange.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;
    windSpeed.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;

    // Obter o ícone correto com base nas condições
    const iconClass = getIconClass(data.weather[0]);
    weatherIcon.className = `wi ${iconClass}`; // Atualizar o ícone no DOM
}














// Função para mapear códigos de ícones para classes da Weather Icons
function getIconClass(weather) {
    const code = weather.icon;  // Código do ícone retornado pela API

    // Mapeamento completo de ícones para cada condição climática
    const iconMap = {
        "01d": "wi-day-sunny",          // Sol (dia)
        "01n": "wi-night-clear",        // Céu limpo (noite)
        "02d": "wi-day-cloudy",         // Nuvens dispersas (dia)
        "02n": "wi-night-alt-cloudy",   // Nuvens dispersas (noite)
        "03d": "wi-cloud",              // Nuvens (dia)
        "03n": "wi-cloud",              // Nuvens (noite)
        "04d": "wi-cloudy",             // Nuvens densas (dia)
        "04n": "wi-cloudy",             // Nuvens densas (noite)
        "09d": "wi-day-showers",        // Chuvas (dia)
        "09n": "wi-night-showers",      // Chuvas (noite)
        "10d": "wi-day-rain",           // Chuva (dia)
        "10n": "wi-night-alt-rain",     // Chuva (noite)
        "11d": "wi-thunderstorm",       // Tempestade (dia)
        "11n": "wi-thunderstorm",       // Tempestade (noite)
        "13d": "wi-snow",               // Neve (dia)
        "13n": "wi-snow",               // Neve (noite)
        "50d": "wi-day-fog",            // Neblina (dia)
        "50n": "wi-night-fog"           // Neblina (noite)
    };

    // Retorna o ícone correspondente com base no código da condição climática
    return iconMap[code] || "wi-na"; // Se o código não for encontrado, retorna um ícone padrão "não disponível"
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

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        fetchWeatherData(city);
    }
});