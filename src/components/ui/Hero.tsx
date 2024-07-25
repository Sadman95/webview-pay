import Image from "next/image";
import React from "react";
import TopBar from "../common/TopBar";

const Hero = () => {
	return (
		// <div className="container w-full h-[400px] mx-auto my-6 relative">
		// 	<div className="absolute top-0 right-0">
		// 		<TopBar />
		// 	</div>
		// 	<img
		// 		className="w-full h-full shadow-md rounded-2xl"
		// 		src={"/images/go-premium-banner.png"}
		// 		alt="subscribe-jpg"
		// 	/>
		// </div>
		<div className="container mx-auto my-6 text-center">
			<h1 className="p-4 text-3xl font-medium text-dark drop-shadow-sm">
				SUBSCRIPTION PRICINGS
			</h1>
			<span className="font-normal tracking-wide text-md text-gray">
				Buy Premium Subscription Of Your Choice
			</span>
		</div>
	);
};

export default Hero;
