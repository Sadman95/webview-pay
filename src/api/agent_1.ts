// apiClient.ts
import { UseDecrypt } from "@/hooks/useDecrypt";
import { ILogin, IOtp, ISignUp } from "@/types/auth.types";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Replace this with your backend API URL
console.log(BASE_URL);
axios.defaults.baseURL = `${BASE_URL}`;
//interceptor for giving token in every request...
axios.interceptors.request.use(
	(config) => {
		//getting token from user state...

		var currentUser = JSON.parse(
			localStorage.getItem("persist:el_app") as string
		)?.user;
		// let tokenkey = currentUser ? currentUser._id + currentUser.email : null;
		const token = localStorage.getItem("el_token")
			? UseDecrypt(localStorage.getItem("el_token") as string)
			: null;

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const register = async (userData: ISignUp) => {
	const response = await axios.post(`${BASE_URL}/auth/register`, userData);
	return response.data;
};

export const login = async (userData: ILogin) => {
	const response = await axios.post(`${BASE_URL}/auth/login`, userData);
	return response.data;
};

export const verifyOtp = async (userData: IOtp) => {
	const response = await axios.post(`${BASE_URL}/otp/verify`, userData);
	return response.data;
};

export const findUserByEmail = async () => {
	const response = await axios.get(`${BASE_URL}/users/profile`);

	return response.data;
};

export const createSubscription = async (
	productId: string,
	priceId: string,
	tokenId: string
) => {
	const response = await axios.post(
		`${BASE_URL}/create-subscription/${productId}`,
		{ priceId, tokenId }
	);
	return response.data;
};

export const getSubscription = async () => {
	const response = await axios.get(`${BASE_URL}/subscription`);
	return response.data;
};

export const cancelSubscription = async (subId: string) => {
	const response = await axios.patch(
		`${BASE_URL}/cancel-subscription/${subId}`
	);
	return response.data;
};
