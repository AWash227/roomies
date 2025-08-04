export const ErrorText = (props: { errors?: string[] }) => {
	const { errors } = props;
	return (
		<p className="text-destructive text-xs">{errors?.join(", ") ?? null}</p>
	);
};
