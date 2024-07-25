import React, { ReactNode } from "react";

interface IProps {
	children: ReactNode;
	classNames?: string;
}

const Container = ({ children, classNames = "" }: IProps) => {
	return <div className={`mx-4 ${classNames}`}>{children}</div>;
};

export default Container;
