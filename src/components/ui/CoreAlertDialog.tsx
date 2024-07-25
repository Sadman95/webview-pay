import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
} from "@/components/bootstrap/index";
import { FC, ReactNode, useRef } from "react";

interface IDialogProps {
	disclosureFn: Function;
	textTrgigger: string;
	alertHeader: string;
	children: ReactNode;
	handlerFn: () => void;
	classNames?: string;
	isLoading?: boolean;
}

const CoreAlertDialog: FC<IDialogProps> = ({
	disclosureFn,
	textTrgigger,
	children,
	alertHeader,
	handlerFn,
	classNames = "",
	isLoading,
}) => {
	const { isOpen, onOpen, onClose } = disclosureFn();
	const cancelRef = useRef(null);

	return (
		<>
			<Button className={classNames} onClick={onOpen}>
				{textTrgigger}
			</Button>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="x-large" fontWeight="bold">
							{alertHeader}
						</AlertDialogHeader>

						<AlertDialogBody fontSize="larger" fontWeight="medium">
							{children}
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button variant="outline" ref={cancelRef} onClick={onClose}>
								Close
							</Button>
							<Button
								variant="outline"
								color="red"
								colorScheme="red"
								onClick={handlerFn}
								ml={3}
								isLoading={isLoading}
							>
								{textTrgigger}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default CoreAlertDialog;
