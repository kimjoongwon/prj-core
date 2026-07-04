export function joinClassNames(
	...classNames: Array<string | false | undefined>
) {
	return classNames.filter(Boolean).join(" ");
}
