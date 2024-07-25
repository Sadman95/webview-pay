"use client";

import { login, verifyOtp } from "@/api/agent_1";
import auth from "@/firebase/firabase.auth";
import { UseEncrypt } from "@/hooks/useEncrypt";
import { setLoginData } from "@/redux/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ILogin, IOtp } from "@/types/auth.types";
import {
	Alert,
	AlertIcon,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	useToast,
} from "@/components/bootstrap/index";
import {
	Field,
	FieldProps,
	Form,
	Formik,
	FormikHelpers,
	FormikProps,
} from "formik";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useMutation } from "react-query";
import { IoIosArrowBack } from "react-icons/io";
import * as Yup from "yup";

const LoginFormSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
});

const OtpFormSchema = Yup.object().shape({
	otp: Yup.string().length(6, "Invalid OTP").required("Required"),
});

const LoginForm: React.FC<{ classNames?: string }> = ({ classNames = "" }) => {
	const [otpForm, setOtpForm] = useState(false);
	const [signInWithEmailAndPassword, user, loading, error] =
		useSignInWithEmailAndPassword(auth);
	const currentUser = useAppSelector((state) => state.auth.user);

	const initialValues: ILogin = { email: "" };
	const initialOtpValues: IOtp = {
		email: currentUser?.email as string,
		otp: "",
	};

	const { isLoading, mutate, isSuccess } = useMutation(login);

	const { isLoading: isOtpLoading, mutate: otpVerifyMutation } =
		useMutation(verifyOtp);

	const toast = useToast();
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleSubmit = (
		values: ILogin,
		formikHelpers: FormikHelpers<ILogin>
	) => {
		mutate(values, {
			onSuccess: (data) => {
				formikHelpers.resetForm();
				const decoded = jwt.verify(
					data.data.token,
					process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string
				) as JwtPayload;
				dispatch(setLoginData(decoded));
				localStorage.setItem("el_token", UseEncrypt(data.data.token));
				toast({
					title: data.message,
					status: "success",
					duration: 9000,
					isClosable: true,
				});
				// setOtpForm(true); // Show OTP form
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
		});
	};

	useEffect(() => {
		if (currentUser && !currentUser.isVerified) {
			setOtpForm(true);
		}
	}, [currentUser]);

	const handleOtpSubmit = (
		values: IOtp,
		formikHelpers: FormikHelpers<IOtp>
	) => {
		otpVerifyMutation(
			{
				email: currentUser?.email as string,
				otp: values.otp,
			},
			{
				onSuccess: (data) => {
					formikHelpers.resetForm();
					const decoded = jwt.verify(
						data.data.token,
						process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string
					) as JwtPayload;
					dispatch(setLoginData(decoded));
					localStorage.setItem("el_token", UseEncrypt(data.data.token));
					toast({
						title: data.message,
						status: data.status,
						duration: 9000,
						isClosable: true,
					});
					router.push("/");
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
	};

	return (
		<>
			{otpForm ? (
				<div className="flex flex-col w-full">
					<IoIosArrowBack
						className="mb-4 cursor-pointer text-primary"
						size={32}
						onClick={() => setOtpForm(!otpForm)}
					/>

					<Formik
						initialValues={initialOtpValues}
						onSubmit={handleOtpSubmit}
						validationSchema={OtpFormSchema}
					>
						{(props: FormikProps<IOtp>) => (
							<Form className={classNames}>
								<Stack spacing={4}>
									<Field name="otp">
										{({ field, form }: FieldProps) => (
											<FormControl
												isInvalid={!!(form.errors.otp && form.touched.otp)}
											>
												<FormLabel className="text-3xl" htmlFor="otp">
													OTP
												</FormLabel>
												<Input
													{...field}
													id="otp"
													type="text"
													placeholder="Enter your OTP"
													className="h-16 text-2xl"
												/>
												<FormErrorMessage>
													{form.errors.otp as ReactNode}
												</FormErrorMessage>
											</FormControl>
										)}
									</Field>

									<Button
										colorScheme="teal"
										type="submit"
										isLoading={isOtpLoading}
										className="border text-slate border-slate rounded-2 hover:text-white"
									>
										Send
									</Button>
								</Stack>

								{error && (
									<Alert status="error">
										<AlertIcon />
										{error?.message}
									</Alert>
								)}
							</Form>
						)}
					</Formik>
				</div>
			) : (
				<Formik
					initialValues={initialValues}
					onSubmit={handleSubmit}
					validationSchema={LoginFormSchema}
				>
					{(props: FormikProps<ILogin>) => (
						<Form className={classNames}>
							<Stack spacing={4}>
								<Field name="email">
									{({ field, form }: FieldProps) => (
										<FormControl
											isInvalid={!!(form.errors.email && form.touched.email)}
										>
											<FormLabel className="text-3xl" htmlFor="email">
												Email
											</FormLabel>
											<Input
												className="h-16 text-2xl"
												{...field}
												id="email"
												type="email"
												placeholder="Enter your email"
											/>
											<FormErrorMessage>
												{form.errors.email as ReactNode}
											</FormErrorMessage>
										</FormControl>
									)}
								</Field>

								<Button
									colorScheme="teal"
									size={"lg"}
									type="submit"
									isLoading={isLoading}
									className="border text-slate border-slate rounded-2 hover:text-white"
								>
									Login
								</Button>
							</Stack>

							{error && (
								<Alert status="error">
									<AlertIcon />
									{error?.message}
								</Alert>
							)}
						</Form>
					)}
				</Formik>
			)}
		</>
	);
};

export default LoginForm;
