import { toggleAuthReducer } from "./features/auth/toggleAuth.slice";
import { authReducer } from "./features/auth/auth.slice";
import { toggleSubscribeReducer } from "./features/subscription/subscription.slice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
	key: "el_app", // load from env
	version: 1,
	storage: storage,
	blackList: ["toggleAuth"],
};

const rootReducer = combineReducers({
	toggleSubscription: toggleSubscribeReducer,
	toggleAuth: toggleAuthReducer,
	auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: { trace: true, traceLimit: 25 },
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
