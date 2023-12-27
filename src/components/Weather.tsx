// src/components/Weather.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

const Weather: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const getWeather = async () => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1b23dd586b036b96e6edcfe17c0c6e8f&units=metric` // api키 설정

      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div>
      <h1>날씨가 궁금해요</h1>
      <input
        type="text"
        placeholder="도시를 입력해주세요."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>검색</button>

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
