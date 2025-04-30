import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function animateValue(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void,
) {
  let startTimestamp: number | null = null

  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    const currentValue = Math.floor(progress * (end - start) + start)

    callback(currentValue)

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

export const formatNumberWithCommas = (val: string) => {
  return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}


// Format currency utility
export const formatCurrency = (value: string | number, locale = 'en-NG', currency = '₦') => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  return `${currency}${value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};