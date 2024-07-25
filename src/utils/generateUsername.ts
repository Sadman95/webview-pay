function generateUsername(email: string) {
	const usernamePrefix = email.split("@")[0];
	const randomSuffix = Math.floor(Math.random() * 10000);
	return `${usernamePrefix}${randomSuffix}`;
}
