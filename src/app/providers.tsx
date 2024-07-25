"use client";

import ReduxProvider from "@/redux/provider";
import stripePromise from "@/utils/stripePromise";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, CircularProgress } from "@/components/bootstrap/index";
import { Elements } from "@stripe/react-stripe-js";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient();
	return (
		<ReduxProvider>
			<SessionProvider>
				<CacheProvider>
					<ChakraProvider
						toastOptions={{ defaultOptions: { position: "top" } }}
					>
						<QueryClientProvider client={queryClient}>
							<Elements stripe={stripePromise}>{children}</Elements>
						</QueryClientProvider>
					</ChakraProvider>
				</CacheProvider>
			</SessionProvider>
		</ReduxProvider>
	);
};

export default Providers;
