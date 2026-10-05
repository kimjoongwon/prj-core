import { TableBody } from "./TableBody";
import { TableContainer } from "./TableContainer";
import { TableFooter } from "./TableFooter";
import { TableHeader } from "./TableHeader";

/** DataGrid와 독립된 native table compound namespace입니다. */
export const Table = {
	Container: TableContainer,
	Header: TableHeader,
	Body: TableBody,
	Footer: TableFooter,
};

export { TableBody, TableContainer, TableFooter, TableHeader };
