import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ToggleSubscribe = {
	isCheckSubscribe: boolean;
};

const initialState = {
	isCheckSubscribe: false,
} as ToggleSubscribe;

export const toggleSubscribe = createSlice({
	name: "toggleSubscribe",
	initialState,
	reducers: {
		reset: () => initialState,
		setToggleSubscribe: (state, action: PayloadAction<boolean>) => {
			state.isCheckSubscribe = action.payload;
		},
	},
});

export const { setToggleSubscribe, reset } = toggleSubscribe.actions;
export const toggleSubscribeReducer = toggleSubscribe.reducer;
