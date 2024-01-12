// src/components/Weather.tsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/main.css";

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

  // 예보 데이터를 날짜별로 그룹화
  const groupedForecastData: { [date: string]: ForecastData[] } = {};
  if (forecastData) {
    forecastData.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!groupedForecastData[date]) {
        groupedForecastData[date] = [];
      }
      groupedForecastData[date].push(forecast);
    });
  }

  return (
    <div className="container">
      <h1>날씨가 궁금해요</h1>
      <input
        type="text"
        placeholder="도시를 입력해주세요."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>검색</button>

      {weatherData && (
        <div className="weather-container">
          <h2>{weatherData.name}</h2>
          <h3>기온 : {weatherData.main.temp.toFixed(1)}° / 습도 : {weatherData.main.humidity}%</h3>
          <p>날씨 : {weatherData.weather[0].main}</p>
        </div>
      )}


      {groupedForecastData && (
        <div className="forecast-container">
          
          {Object.keys(groupedForecastData).map((date) => (
            <div key={date}>
              <h3>{date}</h3>
              <ul className="forecast-list">
                {groupedForecastData[date].map((forecast, index) => (
                  <li key={index} className="forecast-item">
                    
                    <h4>
            {new Date(forecast.dt * 1000).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              // 
            })}
          </h4>
          <p>기온: {forecast.main.temp.toFixed(1)}°</p>
          <p>습도: {forecast.main.humidity}%</p>
          <p>{forecast.weather[0].main}</p>
                    
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;

// 내일은 ~ 날씨가 이어져요
// 내일 아침 최저온도는 오늘보다 ~도 낮아요
// 일출.일몰.
// 미세먼지 / 초미세 / 자외선지수 / 습도 / 바람 