import { IUser } from "@/types/user.types";
import { createSlice } from "@reduxjs/toolkit";

type Auth = {
	user: IUser | null;
};

const initialState = {
	user: null,
} as Auth;

export const authSlice = createSlice({
	name: "authSlice",
	initialState,
	reducers: {
		setLogOut: () => initialState,
		setLoginData: (state, action) => {
			state.user = action.payload;
		},
		setSubscription: (state, action) => {
			if (state.user) {
				if (action.payload) state.user.isSubscribed = true;
				else state.user.isSubscribed = false;
			}
		},
	},
});

export const { setLogOut, setLoginData, setSubscription } = authSlice.actions;
export const authReducer = authSlice.reducer;
