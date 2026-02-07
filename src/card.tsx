import { useState } from "react";
import type { CardProps } from "./types/types";
import {
  formatDate,
  getWholeNumber,
  weatherIcons,
  formatDay,
  formatHour,
} from "./utils/utils";

export const Card = ({ data, loading, unit }: CardProps) => {
  if (loading) {
    return (
      <>
        <SkeletonCard />
      </>
    );
  }
  if (!data) return;
  const [selectedDay, setSelectedDay] = useState(0);

  const getSuffix = (key: string, unit: string) => {
    switch (key) {
      case "apparent_temperature":
        return "°";
      case "relative_humidity_2m":
        return "%";
      case "wind_speed_10m":
        return unit === "Metric" ? " m/s" : " mph";
      case "precipitation":
        return unit === "Metric" ? " mm" : " in";
      default:
        return "";
    }
  };

  const labelCurrent = [
    {
      key: "apparent_temperature",
      label: "Feels like",
      value: getWholeNumber(data?.current?.apparent_temperature),
    },
    {
      key: "relative_humidity_2m",
      label: "Humidity",
      value: getWholeNumber(data?.current?.relative_humidity_2m),
    },
    {
      key: "wind_speed_10m",
      label: "Wind",
      value: getWholeNumber(data?.current?.wind_speed_10m),
    },
    {
      key: "precipitation",
      label: "Precipitation",
      value: getWholeNumber(data?.current?.precipitation),
    },
  ];

  const dates = data.daily?.time.map((_, index) =>
    formatDay(data.daily?.time[index]),
  );

  const hours = data.hourly?.time.slice(
    selectedDay * 24,
    (selectedDay + 1) * 24,
  );
  const handleDayChange = (event: any) => {
    const index = parseInt(event.target.value, 10);
    setSelectedDay(index);
  };
  return (
    <div className="w-full flex flex-col mt-9 justify-center xl:grid xl:grid-cols-[70%_30%] xl:gap-7">
      <div className="">
        <section className="bg-weather text-center rounded-lg p-7">
          <div className="xl:flex xl:flex-row xl:justify-between xl:h-50">
            <div className="xl:content-center xl:text-start">
              <h2 className="text-xl font-bold xl:text-3xl">
                {data.display_name}
              </h2>
              <h3 className="text-md mt-2">{formatDate(data.current?.time)}</h3>
            </div>
            <div className="flex flex-row items-center justify-between mt-7 xl:mt-0 px-3">
              <img
                src={weatherIcons(data.current?.weather_code)}
                alt="icon"
                className="w-25"
              />
              <span className="text-7xl font-black xl:pl-10">
                {getWholeNumber(data.current?.temperature_2m)}°
              </span>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-3 mt-5 xl:mt-7 xl:flex xl:flex-row">
          {labelCurrent.map((item) => {
            const suffix = getSuffix(item.key, unit)
            return (
              <LabelCard
                key={item.key}
                label={item.label}
                value={`${item.value}${suffix}`}
            />
            )
          })}
        </section>
        <h2 className="font-semibold text-lg mt-5 xl:mt-7">Daily forecast</h2>
        <section className="grid grid-cols-3 mt-3 gap-3 text-center xl:flex xl:flex-row">
          {data.daily &&
            Array.from({ length: data.daily.time.length }, (_, i) => (
              <DailyCard
                key={i}
                label={formatDay(data.daily?.time[i])}
                max={getWholeNumber(data.daily?.temperature_2m_max[i])}
                min={getWholeNumber(data.daily?.temperature_2m_min[i])}
                icon={weatherIcons(data.daily?.weather_code[i])}
              />
            ))}
        </section>
      </div>
      <section className="mt-5 lg:mt-0 mb-2">
        <div className="bg-neutral-700 rounded-lg p-3">
          <div className="flex flex-row justify-between">
            <h3 className="font-semibold text-lg self-center">
              Hourly forecast
            </h3>
            <select
              className="bg-neutral-600 p-2 rounded-lg "
              value={selectedDay}
              onChange={handleDayChange}
            >
              {dates?.map((date, index) => (
                <option key={index} value={index}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          {hours?.map((time, i) => (
            <HourlyCard
              key={`${selectedDay}-${i}`}
              label={formatHour(time)}
              temperature={getWholeNumber(
                data.hourly?.temperature_2m[selectedDay * 24 + i],
              )}
              icon={weatherIcons(
                data.hourly?.weather_code[selectedDay * 24 + i],
              )}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export const LabelCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="bg-neutral-700 rounded-lg p-3 pl-5 w-full">
      <h3 className="font-medium text-lg mb-3">{label}</h3>
      <span className="font-medium text-2xl">{value}</span>
    </div>
  );
};

export const DailyCard = ({
  label,
  max,
  min,
  icon,
}: {
  label: string | undefined;
  max: string | undefined;
  min: string | undefined;
  icon: string | undefined;
}) => {
  return (
    <div className="bg-neutral-700 rounded-lg p-3 w-full">
      <h3 className="font-medium text-base">{label}</h3>
      <img src={icon} alt="image" className="w-16 mt-3 m-auto" />
      <div className="flex justify-between mt-3">
        <span className="font-medium">{max}°</span>
        <span className="font-medium">{min}°</span>
      </div>
    </div>
  );
};

export const HourlyCard = ({
  label,
  temperature,
  icon,
}: {
  label: string | undefined;
  temperature: string | undefined;
  icon: string | undefined;
}) => {
  return (
    <div className="flex flex-row bg-neutral-600 rounded-lg p-3 mt-3 justify-between items-center">
      <div className="flex gap-1 items-center">
        <img src={icon} alt="icon" className="w-10" />
        <span className="font-medium text-lg">{label}</span>
      </div>
      <span className="font-medium text-md">{temperature}°</span>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="w-full flex flex-col mt-9 justify-center xl:grid xl:grid-cols-[70%_30%] xl:gap-7">
      <div className="">
        <section className="bg-neutral-500/60 text-center rounded-lg p-7">
          <div className="xl:flex xl:flex-row xl:justify-between xl:h-50"></div>
        </section>
        <section className="grid grid-cols-2 gap-3 mt-5 xl:flex xl:flex-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-neutral-500/60 rounded animate-pulse h-21 w-full"
            />
          ))}
        </section>
        <h2 className="font-semibold text-lg mt-5">Daily forecast</h2>
        <section className="grid grid-cols-3 mt-3 gap-3 text-center xl:flex xl:flex-row">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-neutral-500/60 rounded animate-pulse h-21 w-full"
            />
          ))}
        </section>
      </div>
      <section className="mt-5 lg:mt-0">
        <div className="bg-neutral-700 rounded-lg p-3">
          <div className="flex flex-row justify-between">
            <h3 className="font-semibold text-lg self-center">
              Hourly forecast
            </h3>
            <select className="bg-neutral-600 p-2 rounded-lg " />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-neutral-500/60 rounded animate-pulse h-12 mt-5"
            />
          ))}
        </div>
      </section>
    </div>
  );
};
