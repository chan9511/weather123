// Weather.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, fetchWeatherData } from '../redux/weatherSlice';
import { ForecastData } from '../types';
import { RootState } from '../store/store';
import '../styles/main.css';
import { ThunkAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';



const Weather: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

  const city = useSelector((state: RootState) => state.weather.city);
  const weatherData = useSelector((state: RootState) => state.weather.weatherData);
  const forecastData = useSelector((state: RootState) => state.weather.forecastData);

  const getWeather: ThunkAction<void, RootState, null, AnyAction> = () => {
    dispatch(fetchWeatherData(city));
  };
  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(fetchWeatherData(city));
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
        onChange={(e) => dispatch(setCity(e.target.value))}
      />

<button onClick={handleButtonClick}>검색</button>

      {weatherData && (
        <div className="weather-container">
          <div>{weatherData.name}</div>
          <div>
            기온 : {weatherData.main.temp.toFixed(1)}° / 습도 : {weatherData.main.humidity}%
          </div>
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
                        hour: 'numeric',
                        minute: '2-digit',
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
// + 주간예보