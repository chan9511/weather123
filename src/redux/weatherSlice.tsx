// weatherSlice.tsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WeatherData, ForecastData } from "../types";

interface WeatherState {
  city: string;
  weatherData: WeatherData | null;
  forecastData: ForecastData[] | null;
}

const initialState: WeatherState = {
  city: "",
  weatherData: null,
  forecastData: null,
};

export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async (city: string, { dispatch }) => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1b23dd586b036b96e6edcfe17c0c6e8f&units=metric`
      );
      const forecastResponse = await axios.get<{ list: ForecastData[] }>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1b23dd586b036b96e6edcfe17c0c6e8f&units=metric`
      );

      // setForecastData 대신에 액션을 dispatch 하도록 변경
      dispatch(setForecastData(forecastResponse.data.list));

      console.log(response.data);
      console.log(forecastResponse.data.list);

      return response.data;
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 에러 발생:", error);
      throw error;
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setForecastData: (state, action) => {
      // 직접 state.forecastData를 업데이트하도록 변경
      state.forecastData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.weatherData = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        console.error("날씨 데이터를 가져오는 중 에러 발생:", action.error);
        state.weatherData = null;
      });
  },
});

export const { setCity, setForecastData } = weatherSlice.actions;
export default weatherSlice.reducer;
