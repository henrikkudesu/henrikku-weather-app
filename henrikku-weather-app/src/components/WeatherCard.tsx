import { motion } from 'framer-motion';

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: 'wind' | 'rain' | 'sun' | 'snow';
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  condition,
}) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'wind':
        return (
          <div className="weather-animation wind">
            <div className="cloud"></div>
            <div className="cloud delayed"></div>
            <div className="wind-line wind-line-1"></div>
            <div className="wind-line wind-line-2"></div>
            <div className="wind-line wind-line-3"></div>
          </div>
        );
      case 'rain':
        return (
          <div className="weather-animation rain">
            <div className="cloud rain-cloud"></div>
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="raindrop"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
          </div>
        );
      case 'sun':
        return (
          <div className="weather-animation sun">
            <div className="sun-circle"></div>
            <div className="sun-ray ray-1"></div>
            <div className="sun-ray ray-2"></div>
            <div className="sun-ray ray-3"></div>
            <div className="sun-ray ray-4"></div>
          </div>
        );
      case 'snow':
        return (
          <div className="weather-animation snow">
            <div className="cloud snow-cloud"></div>
            {Array(15)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="snowflake"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 3}s`,
                  }}
                ></div>
              ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`w-64 h-96 bg-gradient-to-b ${
        condition === 'sun'
          ? 'from-blue-400 to-blue-600'
          : condition === 'rain'
          ? 'from-gray-400 to-gray-700'
          : condition === 'snow'
          ? 'from-gray-100 to-gray-400'
          : 'from-gray-300 to-gray-600'
      } text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-between relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {getWeatherIcon()}
      <div className="z-10 mt-auto flex flex-col items-center">
        <h2 className="text-xl font-bold">{city}</h2>
        <p className="text-5xl font-semibold my-2">{temperature}°C</p>
        <p className="text-lg capitalize bg-black/30 px-4 py-1 rounded-full">
          {condition}
        </p>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
