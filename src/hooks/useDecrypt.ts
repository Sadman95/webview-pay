export const UseDecrypt = (encoded: string, salt: string = "12") => {
	const textToChars = (text: string) =>
		text.split("").map((c) => c.charCodeAt(0));
	const applySaltToChar = (code: any) =>
		textToChars(salt).reduce((a, b) => a ^ b, code);
	return encoded
		.match(/.{1,2}/g)
		?.map((hex) => parseInt(hex, 16))
		.map(applySaltToChar)
		.map((charCode) => String.fromCharCode(charCode))
		.join("");
};
