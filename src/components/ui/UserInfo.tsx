import { cancelSubscription } from "@/api/agent_1";
import { Button, useToast } from "@/components/bootstrap/index";
import { setSubscription } from "@/redux/features/auth/auth.slice";
import { useAppDispatch } from "@/redux/hooks";
import { IUser } from "@/types/user.types";
import Link from "next/link";
import { FC } from "react";
import { useMutation } from "react-query";

const UserInfo: FC<{ user: IUser | null | undefined; refetch: () => void }> = ({
	user,
	refetch,
}) => {
	const toast = useToast();
	const dispatch = useAppDispatch();

	const { mutate, isLoading } = useMutation<IUser, any>("cancelSubscription", {
		mutationFn: () => cancelSubscription(user?.subscriptionId as string),
		onSuccess: (data) => {
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
	});

	const handleCancelSubscription = () => {
		mutate();
		dispatch(setSubscription(null));
	};

	return (
		user && (
			<div>
				<p>
					<span className="font-bold text-primary">User name:</span>
					{user.username}
				</p>
				<p>
					<span className="font-bold text-primary">User email:</span>
					{user.email}
				</p>
				<p>
					<span className="font-bold text-primary">User role:</span>
					{user.role}
				</p>

				{user.subscriptionId ? (
					<Button
						variant="solid"
						colorScheme="red"
						className="text-dark hover:text-white"
						onClick={() => handleCancelSubscription()}
						isLoading={isLoading}
					>
						Cancel subscription
					</Button>
				) : (
					<Link href="/#subscriptions">
						<Button>Buy a subscription</Button>
					</Link>
				)}
			</div>
		)
	);
};

export default UserInfo;
