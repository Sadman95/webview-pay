import { IPlan } from "@/types/plans.types";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Replace this with your backend API URL
axios.defaults.baseURL = `${BASE_URL}`;

export const loadPlans = async () => {
	const response = await axios.get(`${BASE_URL}/plans`);

	return response.data.data as IPlan[];
};

export const loadSinglePlan = async (planId: string) => {
	const response = await axios.get(`${BASE_URL}/plans/${planId}`);

	return response.data.data as IPlan;
};

export const loginWithGoogle = async () => {
	const response = await axios.get(`${BASE_URL}/auth/google-redirect`);
	return response.data;
};

export const findUserByProp = async (key: string, value: string) => {
	const response = await axios.get(`${BASE_URL}/users/user?${key}=${value}`);
	return response.data;
};
