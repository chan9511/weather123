// types.ts
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

export type { WeatherData, ForecastData };

// type만 따로 정리
// 타입 객체의 확장성을 위해서는 interface를 사용하는 것이 더 좋다.