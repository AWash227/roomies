"use client";

export const SignUpForm = () => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();

				const body = new FormData(e.currentTarget);
				const obj: Record<string, FormDataEntryValue> = {};
				for (const [key, value] of body.entries()) {
					obj[key] = value;
				}

				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(obj),
				});

				if (!res.ok) {
					// handle error (show message, etc)
				} else {
					// handle success
				}
			}}
		>
			<input type="text" name="email" placeholder="email" />
			<input type="password" name="password" placeholder="password" />
			<button type="submit">Sign Up</button>
		</form>
	);
};
