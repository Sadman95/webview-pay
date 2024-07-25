// src/components/SignUpForm.tsx
import { register } from "@/api/agent_1";
import { loadPlans } from "@/api/agent_2";
import { UseEncrypt } from "@/hooks/useEncrypt";
import { setLoginData } from "@/redux/features/auth/auth.slice";
import { setToggleAuth } from "@/redux/features/auth/toggleAuth.slice";
import { useAppDispatch } from "@/redux/hooks";
import { ISignUp } from "@/types/auth.types";
import { IPlan } from "@/types/plans.types";
import {
	AbsoluteCenter,
	Alert,
	AlertIcon,
	Box,
	Button,
	Divider,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Spinner,
	Stack,
	useMediaQuery,
	useToast,
} from "@/components/bootstrap/index";
import { AxiosError } from "axios";
import { Field, FieldProps, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";
import { useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import Plans from "../ui/Plans";

const SignUpFormSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Required"),
	username: Yup.string().required("Required"),
});

interface IProps {
	classNames: string;
	toggleAuth: boolean;
}

const SignUpForm: FC<IProps> = ({ classNames = "", toggleAuth }) => {
	const initialValues: ISignUp = {
		email: "",
		username: "",
		password: "",
	};

	const { isLoading, mutate } = useMutation("signUp", {
		mutationFn: register,
	});
	const toast = useToast();
	const formikContext = useFormikContext();
	const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");
	const dispatch = useAppDispatch();
	const router = useRouter();

	const {
		data,
		isLoading: plansLoading,
		isError,
		error,
	} = useQuery<IPlan[], AxiosError>("plans", {
		queryFn: () => loadPlans(),
	});

	const handleSubmit = (values: ISignUp) => {
		mutate(values, {
			onSuccess: (data) => {
				formikContext?.resetForm({});
				router.push("/");
				dispatch(
					setLoginData({
						email: data.data.email,
						username: data.data.username,
						_id: data.data._id,
					})
				);
				localStorage.setItem(
					"el_token",
					UseEncrypt(data.token, data.data._id + data.data.email)
				);
				toast({
					title: data.message,
					status: data.status,
					duration: 9000,
					isClosable: true,
				});
				dispatch(setToggleAuth(true));
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

	return (
		<div className={classNames}>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={SignUpFormSchema}
			>
				{({ dirty }) => (
					<Form className={classNames}>
						<Stack spacing={4}>
							<Field name="email">
								{({ field, form }: FieldProps) => (
									<FormControl
										isInvalid={
											(form.errors.email && (form.touched.email as boolean)) ||
											undefined
										}
									>
										<FormLabel htmlFor="email">Email</FormLabel>
										<Input
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

							<Field name="username">
								{({ field, form }: FieldProps) => (
									<FormControl
										isInvalid={
											(form.errors.username &&
												(form.touched.username as boolean)) ||
											undefined
										}
									>
										<FormLabel htmlFor="username">Username</FormLabel>
										<Input
											{...field}
											id="username"
											placeholder="Enter your username"
										/>
										<FormErrorMessage>
											{form.errors.username as ReactNode}
										</FormErrorMessage>
									</FormControl>
								)}
							</Field>

							<Field name="password">
								{({ field, form }: FieldProps) => (
									<FormControl
										isInvalid={
											(form.errors.password &&
												(form.touched.password as boolean)) ||
											undefined
										}
									>
										<FormLabel htmlFor="password">Password</FormLabel>
										<Input
											{...field}
											id="password"
											type="password"
											placeholder="Enter your password"
										/>
										<FormErrorMessage>
											{form.errors.password as ReactNode}
										</FormErrorMessage>
									</FormControl>
								)}
							</Field>

							<Button
								colorScheme="teal"
								type="submit"
								isLoading={isLoading}
								className="text-slate hover:text-white"
								disabled={!dirty}
							>
								Sign Up
							</Button>
						</Stack>
					</Form>
				)}
			</Formik>
			<Box position="relative" padding="10">
				<Divider orientation={isLargerThanMd ? "vertical" : "horizontal"} />
				<AbsoluteCenter bg="white" px="4">
					or
				</AbsoluteCenter>
			</Box>
			<div>
				{isError ? (
					<Alert status="error" variant="left-accent">
						<AlertIcon />
						{error.message}
					</Alert>
				) : (
					<div className="flex justify-center align-middle">
						{plansLoading ? (
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
				)}
			</div>
		</div>
	);
};

export default SignUpForm;
