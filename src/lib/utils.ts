import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pino from "pino";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const logger = pino({
	transport: {
		target: "pino-pretty",
	},
});
