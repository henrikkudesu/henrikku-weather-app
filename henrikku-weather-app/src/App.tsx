import { useState, KeyboardEvent, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import { fetchWeather } from './api/weather';
import { motion, AnimatePresence } from 'framer-motion';

type WeatherCondition = 'wind' | 'rain' | 'sun' | 'snow';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<{
    city: string;
    temperature: number;
    condition: WeatherCondition;
  } | null>(null);
  const [error, setError] = useState('');
  const [bgClass, setBgClass] = useState('bg-default');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Atualiza a classe de fundo quando a condição climática muda
  useEffect(() => {
    if (weather) {
      // Iniciamos a transição
      setIsTransitioning(true);

      // Pequeno delay para que a classe anterior permaneça um pouco
      const timer = setTimeout(() => {
        setBgClass(`bg-${weather.condition}`);

        // Após definir a nova classe, ainda esperamos um pouco para terminar a transição
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1500);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setBgClass('bg-default');
    }
  }, [weather]);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await fetchWeather(city);
      if (data) {
        setWeather(data);

        // Adiciona à lista de buscas recentes (sem duplicatas)
        if (!recentSearches.includes(city)) {
          setRecentSearches((prev) => [city, ...prev].slice(0, 5));
        }
      } else {
        setError('City not found');
      }
    } catch {
      setError('An error occurred while fetching weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRecentSearch = (city: string) => {
    setCity(city);
    handleSearch();
  };

  return (
    <div
      className={`app-container ${bgClass} ${
        isTransitioning ? 'transitioning' : ''
      }`}
    >
      <div className="content-container">
        <motion.h1
          className="text-3xl font-bold mb-6 text-white text-center drop-shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Weather Forecast
        </motion.h1>

        <motion.div
          className="flex flex-col sm:flex-row gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Enter a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-4 py-3 rounded-lg text-gray-800 bg-white/90 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Buscando...
              </span>
            ) : (
              'Buscar'
            )}
          </button>
        </motion.div>

        {/* Buscas recentes */}
        {recentSearches.length > 0 && (
          <motion.div
            className="mb-6 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-md text-white">Recent searches:</span>
            {recentSearches.map((item) => (
              <button
                key={item}
                onClick={() => handleRecentSearch(item)}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-full transition-all"
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-lg mb-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {weather && (
            <motion.div
              className="flex justify-center"
              key={weather.city} // Importante para a animação
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <WeatherCard
                city={weather.city}
                temperature={weather.temperature}
                condition={weather.condition}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
