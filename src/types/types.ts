export type CurrentWeather = {
  time: Date;                    
  temperature_2m: number;       
  apparent_temperature: number;
  precipitation: number;
  wind_speed_10m: number;
  weather_code: number;
  relative_humidity_2m: number;
};

export type HourlyWeather = {
  time: Date[];                   
  temperature_2m: Float32Array | null;        
  weather_code: Float32Array | null;
};

export type DailyWeather = {
  time: Date[];                 
  weather_code: Float32Array | null;
  temperature_2m_max: Float32Array | null;
  temperature_2m_min: Float32Array | null;
};

export type Weather = {
  display_name: string;
  current: CurrentWeather | null;
  hourly: HourlyWeather | null;
  daily: DailyWeather | null;
};



export type CardProps = {
    onRefresh?: () => Promise<void> | void;
    data: Weather | null;
    loading?: boolean;
    unit: string;
}


export type Place = {
  display_name: string;
  place_id: number;
}

export type HeaderProps = {
  unit: string;
  setUnit: (u: string) => void;
};