import "./globals.css";
import TopBar from "@/components/common/TopBar";
import Footer from "@/components/common/Footer";
import Head from "next/head";
import Providers from "./providers";
import { Poppins } from "next/font/google";
import Hero from "@/components/ui/Hero";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: "100",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en" className={poppins.className}>
			<Head>
				<title>Webview-Pay</title>
				<meta name="description" content="Payment webview" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<body className="h-screen overflow-y-auto">
				<Providers>
					{/* <div className="absolute bottom-0 w-full">
						<TopBar />
					</div> */}
					<Hero />
					{children}
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
