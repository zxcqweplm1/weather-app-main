import { fetchWeatherApi } from "openmeteo";
import { getCoordinates } from "./nominatim";

const url = "https://api.open-meteo.com/v1/forecast";

export const openMeteo = async (location: string, unit: string) => {
  let params;
  try {
    const coordinates = await getCoordinates(location);
    if (!coordinates) return;
    if (unit === "Metric") {
      params = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        hourly: ["temperature_2m", "weather_code"],
        current: [
          "temperature_2m",
          "apparent_temperature",
          "precipitation",
          "wind_speed_10m",
          "weather_code",
          "relative_humidity_2m",
        ],
        timezone: "auto",
      };
    } else if (unit === "Imperial") {
      params = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        hourly: ["temperature_2m", "weather_code"],
        current: [
          "temperature_2m",
          "apparent_temperature",
          "precipitation",
          "wind_speed_10m",
          "weather_code",
          "relative_humidity_2m",
        ],
        wind_speed_unit: "mph",
        temperature_unit: "fahrenheit",
        precipitation_unit: "inch",
        timezone: "auto",
      };
    }

    const responses = await fetchWeatherApi(url, params);
    if (!responses) throw new Error("API error ${responses.status}");
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;
    const display_name = coordinates.display_name;
    const weatherData = {
      display_name: display_name,
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature_2m: current.variables(0)!.value(),
        apparent_temperature: current.variables(1)!.value(),
        precipitation: current.variables(2)!.value(),
        wind_speed_10m: current.variables(3)!.value(),
        weather_code: current.variables(4)!.value(),
        relative_humidity_2m: current.variables(5)!.value(),
      },
      hourly: {
        time: Array.from(
          {
            length:
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          },
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000,
            ),
        ),
        temperature_2m: hourly.variables(0)!.valuesArray(),
        weather_code: hourly.variables(1)!.valuesArray(),
      },
      daily: {
        time: Array.from(
          {
            length:
              (Number(daily.timeEnd()) - Number(daily.time())) /
              daily.interval(),
          },
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000,
            ),
        ),
        weather_code: daily.variables(0)!.valuesArray(),
        temperature_2m_max: daily.variables(1)!.valuesArray(),
        temperature_2m_min: daily.variables(2)!.valuesArray(),
      },
    };
    return weatherData;
  } catch (err) {
    console.log(err);
  }
};
