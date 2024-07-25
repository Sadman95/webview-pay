export const UseEncrypt = (text: string, salt: string = "12") => {
	const textToChars = (text: string) =>
		text.split("").map((c) => c.charCodeAt(0));
	const byteHex = (n: string) => ("0" + Number(n).toString(16)).substr(-2);
	const applySaltToChar = (code: any) =>
		textToChars(salt).reduce((a, b) => a ^ b, code);

	return text
		.split("")
		.map(textToChars)
		.map(applySaltToChar)
		.map(byteHex)
		.join("");
};
