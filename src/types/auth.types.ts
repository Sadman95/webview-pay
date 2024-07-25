export interface ILogin {
	email: string;
	password?: string;
}

export interface ISignUp extends ILogin {
	username: string;
	role?: string;
}

export interface IOtp {
	email: string;
	otp: string;
}
