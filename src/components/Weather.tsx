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

const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
 

  const getWeather = async () => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1b23dd586b036b96e6edcfe17c0c6e8f&units=metric` // api키 설정
      );
      // await로 비동기로 받아옴.
      setWeatherData(response.data);
      console.log("Weather data fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
   
    }
  };

  return (
    <div>
      <h1>현재 날씨</h1>
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
          {/* 기온 소수점 첫째자리까지 toFixed(1)*/}
          <p>{weatherData.weather[0].main}</p>
          {/* 영어로 표현된 clouds->흐림 한국말로 변환 switch case */}
        </div>
      )}
    </div>
  );
};

export default Weather;