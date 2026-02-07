import { icons } from "./icons";

    export function formatDate(isoDate?: Date) {
    if(!isoDate) return;
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  export function formatDay(isoDate?: Date) {
    if(!isoDate) return;
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "UTC",
    }).format(date);
  }

  export function formatHour(isoDate?: Date) {
    if(!isoDate) return;
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      timeZone: "UTC",
    }).format(date);
  }


export function getWholeNumber(value?: number) {
  if(value == null || Number.isNaN(value)) return;
  return Number.isInteger(value) ? String(value) : Math.round(value).toString();
}


export function weatherIcons(code: number | undefined) {
    if(!code) return icons.sunny;
    if([0].includes(code)) return icons.sunny;
    if([1, 2].includes(code)) return icons.partlyCloudy;
    if([3].includes(code)) return icons.overcast;
    if([45, 48].includes(code)) return icons.fog;
    if([51, 53, 55, 56, 57].includes(code)) return icons.drizzle;
    if([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return icons.rain;
    if([71, 73, 75, 77, 85, 86].includes(code)) return icons.snow;
    if([95, 96, 99].includes(code)) return icons.storm;
}

