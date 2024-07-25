export interface IPlan {
	pId: string;
	priceId: string;
	name: string;
	active: boolean;
	price: string;
	description: string | null;
	features: string[];
}
