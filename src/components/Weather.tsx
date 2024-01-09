// src/components/Weather.tsx
import React, { useState } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
}

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
}

const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);

  const getWeather = async () => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1b23dd586b036b96e6edcfe17c0c6e8f&units=metric`
      );
      setWeatherData(response.data);

      const forecastResponse = await axios.get<{ list: ForecastData[] }>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1b23dd586b036b96e6edcfe17c0c6e8f&units=metric`
      );
      setForecastData(forecastResponse.data.list);

      console.log("Weather data fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
      setForecastData(null);
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
          <h3>기온 : {weatherData.main.temp.toFixed(1)}° / 습도 : {weatherData.main.humidity}%</h3>
          <p>{weatherData.weather[0].main}</p>
        </div>
      )}

      {forecastData && (
        <div>
          <h2>날씨 예보</h2>
          <ul>
            {forecastData.map((forecast, index) => (
              <li key={index}>
                {new Date(forecast.dt * 1000).toLocaleDateString()} - 기온: {forecast.main.temp.toFixed(1)}°
              </li>
              //분할 해야함
              
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weather;
