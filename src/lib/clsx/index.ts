import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function cn(...allInputs: ClassValue[]): string {
  return twMerge(clsx(...allInputs));
}