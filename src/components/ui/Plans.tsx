import { IPlan } from "@/types/plans.types";

import React, { FC } from "react";
import SinglePlan from "./SinglePlan";
import { Flex } from "@/components/bootstrap/index";

const Plans: FC<{ plans: IPlan[] | undefined }> = ({ plans }) => {
	return (
		<Flex className="container flex-col justify-center gap-4 align-middle md:flex-row">
			{plans &&
				plans.map((plan: IPlan) => <SinglePlan key={plan.pId} plan={plan} />)}
		</Flex>
	);
};

export default Plans;
