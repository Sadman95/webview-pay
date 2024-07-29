"use client";

import { createSubscription } from "@/api/agent_1";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	FormControl,
	FormLabel,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Text,
	useToast,
} from "@/components/bootstrap/index";
import { setSubscription } from "@/redux/features/auth/auth.slice";
import { setToggleAuth } from "@/redux/features/auth/toggleAuth.slice";
import { setToggleSubscribe } from "@/redux/features/subscription/subscription.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPlan } from "@/types/plans.types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { FC, MouseEvent, ReactNode } from "react";
import { useMutation } from "react-query";

interface Props {
	overlay: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	plan: IPlan;
	refetchSubscription: () => void;
}

const CheckoutModal: FC<Props> = ({
	overlay,
	isOpen,
	onClose,
	plan,
	refetchSubscription,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const user = useAppSelector((state: RootState) => state.auth.user);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const toast = useToast();

	const cardElement = elements && elements.getElement(CardElement);

	const { mutate, isLoading, isSuccess } = useMutation("createSubscription", {
		mutationFn: (tokenId: string) =>
			createSubscription(plan.pId, plan.priceId, tokenId),
		onSuccess: (data) => {
			dispatch(setSubscription(data.data.subscriptionId));
			toast({
				title: "Success",
				description: "Payment successful",
				status: "success",
				duration: 9000,
				isClosable: true,
			});
			refetchSubscription();
			router.push("/");
			onClose();
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
		onSettled: () => {
			onClose();
		},
	});

	const handlePay = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!user || !user.isVerified) {
			router.push("/");
			dispatch(setToggleAuth(true));
			dispatch(setToggleSubscribe(false));
			onClose();
			return;
		}
		if (stripe && cardElement) {
			const { token, error } = await stripe.createToken(cardElement);
			if (error) {
				console.error("Error creating token:", error);
				return;
			}
			mutate(token.id);
		}
	};

	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose} size={"full"}>
			{overlay}
			<ModalContent className="w-full overflow-y-scroll h-3/4">
				<div className="p-2">
					<ModalHeader className="text-2xl">Checkout</ModalHeader>
					<ModalCloseButton />
				</div>
				<ModalBody className="flex flex-col justify-between gap-4 overflow-hidden align-middle md:flex-row">
					{/* <Card variant={"filled"} className="w-full h-full">
						<CardHeader>
							<Heading size="md">{plan.name}</Heading>
						</CardHeader>
						<CardBody>
							<Text>{plan.description}</Text>
							<Text className="text-8xl">{plan.price}</Text>
						</CardBody>
					</Card> */}
					<FormControl
						mb={2}
						bg={"gray.100"}
						className="h-full p-2 rounded-md shadow "
					>
						<FormLabel className="text-2xl">Payment Information</FormLabel>
						<CardElement
							options={{
								style: {
									base: {
										fontSize: "16px",
										color: "#424770",
										"::placeholder": {
											color: "#aab7c4",
										},
										lineHeight: "32px",
									},
									invalid: {
										color: "#9e2146",
									},
								},
							}}
						/>
						<div className="">
							<img src="/images/card-pay.png" alt="" className="w-full " />
						</div>
					</FormControl>
				</ModalBody>
				<ModalFooter justifyContent="flex-end">
					<Button
						className="border text-dark hover:text-white border-slate"
						colorScheme="blue"
						mr={3}
						onClick={(e: MouseEvent<HTMLButtonElement>) => handlePay(e)}
						isLoading={isLoading}
					>
						Pay to Subscribe
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CheckoutModal;
