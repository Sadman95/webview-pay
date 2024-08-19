"use client"

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cancelSubscription, getSubscription } from "../../api/agent_1";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Heading,
	Stack,
	Text,
	useDisclosure,
	useToast,
} from "../bootstrap/index";

import { List, ListIcon, ListItem } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { connect } from "react-redux";
import { setSubscription } from "../../redux/features/auth/auth.slice";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import socket from "../../socket";
import { IPlan } from "../../types/plans.types";
import { IUser } from "../../types/user.types";
import stripePromise from "../../utils/stripePromise";
import CheckoutModal from "./CheckoutModal";
import CoreAlertDialog from "./CoreAlertDialog";

interface IData {
	priceId: string;
	subId: string;
}

const SinglePlan: React.FC<{ plan: IPlan; currentUser: IUser | null }> = ({
	plan,
	currentUser,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [subPriceId, setSubPriceId] = useState<IData | null>(null);

	interface IResponse {
		data: {
			id: string;
			plan: {
				id: string;
			};
		};
	}

	const { data, refetch, isError } = useQuery<IResponse, AxiosError>(
		"subscription",
		getSubscription
	);

	useEffect(() => {
		if (data) {
			setSubPriceId({
				priceId: data.data.plan.id,
				subId: data.data.id,
			});
		} else if (isError) setSubPriceId(null);
		else {
			setSubPriceId(null);
		}
	}, [data, currentUser, isError]);

	useEffect(() => {

		if (!currentUser) return;

		const email = currentUser.email;

		const handler = () => refetch();
		const setter = () => setSubPriceId(null);

		socket.on(`user:subscription:${email}`, () => {
			refetch();
		});

		socket.on(`user:unsubscribe:${email}`, () => {
			setSubPriceId(null);
		});

		return () => {
			socket.off(`user:subscription:${email}`, handler);
			socket.off(`user:unsubscribe:${email}`, setter);
		};
	}, [currentUser, data]);

	const handleSubscribe = () => {
		onOpen();
	};
	const toast = useToast();
	const dispatch = useAppDispatch();

	const { mutate, isLoading: isCancelLoading } = useMutation(
		"cancelSubscription",
		{
			mutationFn: () =>
				cancelSubscription(currentUser?.subscriptionId as string),
			onSuccess: (data) => {
				setSubPriceId(null);
				socket.emit("unsubscribe", { ...data });
				refetch();
			},

			onError: (error: any) => {
				toast({
					title: "Error",
					description: error.response.data.message,
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			},
		}
	);

	const handleCancelSubscription = () => {
		mutate();
		dispatch(setSubscription(null));
	};

	return (
		<>
			<Elements stripe={stripePromise}>
				<CheckoutModal
					refetchSubscription={refetch}
					isOpen={isOpen}
					onClose={onClose}
					plan={plan}
				/>
			</Elements>
			<Card
				className="w-auto px-12 bg-primary text-white"
				bgColor={"bg-primary"}
				textColor={"text-white"}
			>
				<CardBody>
					<Stack mt="6" spacing="3">
						<div className="text-center">
							<Heading size="xl">{plan.name}</Heading>
							<Text>{plan.description}</Text>
						</div>
						<List spacing={3} className="flex flex-col gap-4 text-xl py-4">
							{plan.features.map((item, i) => (
								<ListItem key={i}>
									<ListIcon as={IoMdCheckmarkCircle} color="green.500" />
									{item}
								</ListItem>
							))}
						</List>
						<Text
							className="text-center"
							color={plan.name == "Monthly" ? "white" : "black"}
							fontSize="6xl"
						>
							{plan.price}
						</Text>
					</Stack>
				</CardBody>
				<CardFooter>
					{currentUser?.subscriptionId == subPriceId?.subId ? (
						<CoreAlertDialog
							isLoading={isCancelLoading}
							alertHeader="Cancel Subscription"
							disclosureFn={useDisclosure}
							handlerFn={handleCancelSubscription}
							textTrgigger="Cancel Subscription"
							classNames="mx-auto p-2 font-semibold rounded-md bg-secondary hover:text-slate text-white"
						>
							<span>Do you want to unscribe?</span>
						</CoreAlertDialog>
					) : (
						<Button
							className={`mx-auto p-2 font-semibold rounded-md bg-danger hover:text-slate text-white`}
							variant="solid"
							onClick={handleSubscribe}
						>
							Subscribe
						</Button>
					)}
				</CardFooter>
			</Card>
		</>
	);
};

const mapStateProps = (state: RootState) => ({
	currentUser: state.auth.user,
	//the State.App & state.App.Items.List/Filters are reducers used as an example.
});

export default connect(
	mapStateProps

	// mapDispatchToProps,  that's another subject
)(SinglePlan);
