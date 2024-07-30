"use client";

import { useDisclosure } from "@/components/bootstrap/index";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Auth from "../auth/Auth";

const TopBar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toggleAuth = useAppSelector(
		(state: RootState) => state.toggleAuth.toggleAuth
	);
	const user = useAppSelector((state: RootState) => state.auth.user);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { data: session } = useSession();

	const triggerLogin = () => {
		onOpen();
		// dispatch(setToggleAuth(true));
	};

	// const triggerSignup = () => {
	// 	onOpen();
	// 	dispatch(setToggleAuth(false));
	// };
	// const handleLogOut = () => {
	// 	if (session?.user) {
	// 		signOut();
	// 		localStorage.removeItem("nextauth.message");
	// 	}
	// 	dispatch(setLoginData(null));
	// 	localStorage.removeItem("el_token");
	// 	localStorage.removeItem("persist:el_app");
	// 	router.push("/");
	// };

	useEffect(() => {
		if (!user || !user.isVerified) {
			return triggerLogin();
		}
	}, [user]);

	if (isOpen && (!user || !user.isVerified)) {
		return (
			<Auth
				isOpen={isOpen}
				onClose={onClose}
				onOpen={onOpen}
				toggleAuth={toggleAuth}
			/>
		);
	}

	return (
		// <div className="flex flex-col gap-4 align-middle md:flex-row">
		// 	{user || session?.user ? (
		// 		<Button
		// 			onClick={handleLogOut}
		// 			className="p-4 font-semibold rounded-md bg-warning text-slate hover:bg-red-500"
		// 		>
		// 			Log out
		// 		</Button>
		// 	) : (
		// 		<>
		// 			<Button
		// 						onClick={triggerLogin}
		// 						className="p-2 font-semibold rounded-md text-slate"
		// 					>
		// 						Login
		// 					</Button>
		// 			<Button
		// 						onClick={triggerSignup}
		// 						className="p-2 font-semibold rounded-md text-slate"
		// 					>
		// 						Sign Up
		// 					</Button>
		// 		</>
		// 	)}
		// </div>
		<div>
			{/* <Button
				onClick={handleLogOut}
				className={`hover:text-white w-full p-4 py-6 drop-shadow font-semibold rounded-md bg-warning text-slate hover:bg-red-500 ${
					!user && "hidden"
				}`}
			>
				Log out
			</Button> */}
		</div>
	);
};

export default TopBar;
