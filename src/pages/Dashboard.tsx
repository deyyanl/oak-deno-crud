import { retrieveUser } from '../utils/user.ts';
import React, { useState } from "https://esm.sh/react@18.2.0";

const Dashboard = () => {
	const [success, setSuccess] = useState(false);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// get form data
		const { name, content } = e.target.elements;
		const formData = {
			name: name.value,
			content: content.value,
			author: retrieveUser().user,
		};
		const res = await fetch('http://localhost:8000/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});
		const data = await res.json();
		if (data.success) setSuccess(true);
	};

	return (
		<>
			<h1>Dashboard</h1>
			<h2>Create article</h2>
			<form onSubmit={handleSubmit} className='inputs'>
				<input type='text' name='name' placeholder='Article name' />
				<textarea
					name='content'
					id='content'
					placeholder='Content'
					cols={30}
					rows={10}></textarea>
				<button type='submit'>Submit</button>
				{success && <p>Article created successfully!</p>}
			</form>
		</>
	);
};
export default Dashboard;
