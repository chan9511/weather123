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

      console.log("불러온 현재시각 데이터:", response.data);
      console.log("불러온 예보 데이터:", forecastResponse.data.list);
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
      <div className="main-name">웨더웨더</div>
      <input
        type="text"
        placeholder="도시를 입력해주세요."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>검색</button>

      {weatherData && (
        <div className="weather-container">
          <div>{weatherData.name}</div>
          <div>기온 : {weatherData.main.temp.toFixed(1)}° / 습도 : {weatherData.main.humidity}%</div>
          <div>날씨 : {weatherData.weather[0].main}</div>
        </div>
      )}


      {groupedForecastData && (
        <div className="forecast-container">
          
          {Object.keys(groupedForecastData).map((date) => (
            <div key={date}>
              <div className="date-item">{date}</div>
              <div className="date-item">평균기온</div>
              <div className="forecast-list">
                {groupedForecastData[date].map((forecast, index) => (
                  <div key={index} className="forecast-item">
                    
                    <div>
            {new Date(forecast.dt * 1000).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div>기온: {forecast.main.temp.toFixed(1)}°</div>
          <div>습도: {forecast.main.humidity}%</div>
          <div>{forecast.weather[0].main}</div>
                    
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;

// 아이디어 추가
// 내일은 ~ 날씨가 이어져요
// 내일 아침 최저온도는 오늘보다 ~도 낮아요
// 일출.일몰.
// 미세먼지 / 초미세 / 자외선지수 / 습도 / 바람 
// + 지금 일 + 4일까지만 데이터받아서 표현하기