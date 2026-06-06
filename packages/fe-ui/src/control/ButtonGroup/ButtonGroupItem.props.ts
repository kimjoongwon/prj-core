import type { ButtonProps } from "../Button/Button";

export interface ButtonGroupItem extends Omit<ButtonProps, "as" | "href"> {
	id: string;
}
