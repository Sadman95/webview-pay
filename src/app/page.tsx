"use client";

import { loadPlans } from "@/api/agent_2";
import { Spinner } from "@/components/bootstrap/index";
import Footer from "@/components/common/Footer";
import TopBar from "@/components/common/TopBar";
import Plans from "@/components/ui/Plans";
import { useAppSelector } from "@/redux/hooks";
import socket from "@/socket";
import { IPlan } from "@/types/plans.types";
import { AxiosError } from "axios";
import { Metadata } from "next";
import { useEffect } from "react";
import { useQuery } from "react-query";

const metadata: Metadata = {
	title: "Web-Pay",
	description: "Go for payment to buy premium subscription",
	authors: [
		{
			name: "Sadman Sakib",
			url: "https://www.linkedin.com/in/sadman-sakib-082083201/",
		},
	],
	creator: "Sadman Sakib",
	other: {
		org: "Alchemy Software Limited Chattogram",
		url: "https://alchemy-bd.com",
	},
};

const Page = () => {
	const { data, isLoading, refetch } = useQuery<IPlan[], AxiosError>(
		"plans",
		loadPlans,
		{
			notifyOnChangeProps: ["data", "error"],
		}
	);

	const currentUser = useAppSelector((state) => state.auth.user);

	useEffect(() => {
		if (currentUser?.isSubscribed) {
			socket.emit("get:subscription", {
				...currentUser,
			});
		}
		return () => {
			socket.off("get:subscription");
		};
	}, [currentUser]);

	return (
		<>
			<TopBar />
			{/* <Hero /> */}
			{/* 
			------------------------
			TODO:
			------------------------
			*/}
			<div className="flex justify-center my-6 align-middle">
				{isLoading ? (
					<Spinner
						thickness="4px"
						speed="0.65s"
						emptyColor="gray.200"
						color="blue.500"
						size="xl"
					/>
				) : (
					<Plans plans={data} />
				)}
			</div>
			<Footer />
		</>
	);
};

export default Page;
