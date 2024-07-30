"use client";

import {
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
} from "@/components/bootstrap/index";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IUser } from "@/types/user.types";
import { FC, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface IProps {
	isOpen: boolean;
	toggleAuth: boolean;
	onClose: () => void;
	onOpen: () => void;
}

const Auth: FC<IProps> = ({ isOpen, onClose, onOpen, toggleAuth }) => {
	const user: IUser | null = useAppSelector(
		(state: RootState) => state.auth.user
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (user && user.isVerified) {
			return onClose();
		}
	}, [user]);

	const handleOnClose = () => {
		// dispatch(setToggleAuth(!toggleAuth));
		if (user && user.isVerified) {
			return onClose();
		}
	};

	return (
		<Modal onClose={handleOnClose} size="full" isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent>
				{/* <ModalCloseButton onClick={handleOnClose} cursor={"pointer"} /> */}
				<ModalBody className="flex flex-col justify-between w-full mt-16 align-middle md:flex-row">
					{toggleAuth ? (
						<LoginForm classNames={`w-full`} />
					) : (
						<SignUpForm toggleAuth={toggleAuth} classNames="w-full d-flex" />
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default Auth;
