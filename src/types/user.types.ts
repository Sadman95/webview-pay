export enum Role {
	"USER",
	"ADMIN",
}

export interface IUser {
	custId?: string;
	subscriptionId?: string;
	avatar?: string;
	username?: string;
	email?: string;
	role?: Role.ADMIN | Role.USER;
	isVerified: boolean;
	isSubscribed: boolean;
}
