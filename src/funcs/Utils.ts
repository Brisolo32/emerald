// This is just an RNG lol
export const randomNumber = (start: number, max: number) =>
	Math.floor(Math.random() * max) + start;

// Checks to see if the text is empty
export const isEmpty = (string: string) =>
	string === undefined || string.length === 0 || !string.trim();
