"use client";

// src/components/MonthlySubscription.tsx
import { cancelSubscription, getSubscription } from "@/api/agent_1";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Divider,
	Heading,
	ModalOverlay,
	Stack,
	Text,
	useDisclosure,
	useToast,
} from "@/components/bootstrap/index";
import { setSubscription } from "@/redux/features/auth/auth.slice";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import socket from "@/socket";
import { IPlan } from "@/types/plans.types";
import { IUser } from "@/types/user.types";
import { List, ListIcon, ListItem } from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { connect } from "react-redux";
import CheckoutModal from "./CheckoutModal";
import CoreAlertDialog from "./CoreAlertDialog";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

interface IData {
	priceId: string;
	subId: string;
}

const OverlayOne = () => (
	<ModalOverlay
		bg="blackAlpha.300"
		backdropFilter="blur(10px) hue-rotate(90deg)"
	/>
);

const SinglePlan: React.FC<{ plan: IPlan; currentUser: IUser | null }> = ({
	plan,
	currentUser,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [overlay, setOverlay] = useState(<OverlayOne />);
	const [subPriceId, setSubPriceId] = useState<IData | null>(null);

	const { data, isLoading, refetch, isError } = useQuery<any, AxiosError>(
		"subscription",
		getSubscription,
		{
			retryOnMount: false,
		}
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

		socket.on(`user:subscription:${email}`, (data) => {
			handler;
		});

		socket.on(`user:unsubscribe:${email}`, (data) => {
			setter;
		});

		return () => {
			socket.off(`user:subscription:${email}`, handler);
			socket.off(`user:unsubscribe:${email}`, setter);
		};
	}, [currentUser, data]);

	const handleSubscribe = () => {
		setOverlay(<OverlayOne />);
		onOpen();
	};
	const toast = useToast();
	const dispatch = useAppDispatch();

	const { mutate, isLoading: isCancelLoading } = useMutation<IUser, any>(
		"cancelSubscription",
		{
			mutationFn: () => cancelSubscription(subPriceId?.subId as string),
			onSuccess: (data) => {
				setSubPriceId(null);
				socket.emit("unsubscribe", { ...data });
				refetch();
			},
			onError: (error) => {
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
			<CheckoutModal
				refetchSubscription={refetch}
				overlay={overlay}
				isOpen={isOpen}
				onClose={onClose}
				plan={plan}
			/>
			<Card
				className={`w-full ${
					plan.name == "Monthly" ? "bg-primary" : "bg-warning"
				} ${plan.name == "Monthly" ? "text-white" : "text-dark"}`}
			>
				<CardBody>
					<Stack mt="6" spacing="3">
						<Heading size="lg">{plan.name}</Heading>
						<Text>{plan.description}</Text>
						<List spacing={3}>
							{plan.features.map((item, i) => (
								<ListItem key={i}>
									<ListIcon as={IoMdCheckmarkCircle} color="green.500" />
									{item}
								</ListItem>
							))}
						</List>
						<Text
							color={plan.name == "Monthly" ? "white" : "black"}
							fontSize="4xl"
						>
							{plan.price}
						</Text>
					</Stack>
				</CardBody>
				<Divider />
				<CardFooter>
					{plan.priceId == subPriceId?.priceId ? (
						// <Button
						// 	className={`p-2 font-semibold rounded-md bg-secondary hover:text-slate text-white`}
						// 	variant="solid"
						// 	onClick={handleCancelSubscription}
						// 	isLoading={isCancelLoading}
						// >
						// 	Cancel subscription
						// </Button>
						<CoreAlertDialog
							isLoading={isCancelLoading}
							alertHeader="Cancel Subscription"
							disclosureFn={useDisclosure}
							handlerFn={handleCancelSubscription}
							textTrgigger="Cancel Subscription"
							classNames="p-2 font-semibold rounded-md bg-secondary hover:text-slate text-white"
						>
							<span>Do you want to unscribe?</span>
						</CoreAlertDialog>
					) : (
						<Button
							className={`p-2 font-semibold rounded-md bg-danger hover:text-slate text-white`}
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
