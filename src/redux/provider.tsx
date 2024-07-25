import { PersistGate } from "@/components/bootstrap";
import { Provider } from "@/components/bootstrap";
import { PropsWithChildren } from "react";
import { persistor, store } from "./store";

function ReduxProvider({ children }: PropsWithChildren) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	);
}

export default ReduxProvider;
