import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ToggleAuth = {
	toggleAuth: boolean;
};

const initialState = {
	toggleAuth: true,
} as ToggleAuth;

export const toggleAuthSlice = createSlice({
	name: "toggleAuth",
	initialState,
	reducers: {
		reset: () => initialState,
		setToggleAuth: (state, action: PayloadAction<boolean>) => {
			state.toggleAuth = action.payload;
		},
	},
});

export const { setToggleAuth, reset } = toggleAuthSlice.actions;
export const toggleAuthReducer = toggleAuthSlice.reducer;
