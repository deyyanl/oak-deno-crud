import { render } from 'https://esm.sh/react-dom@18.2.0';
import React, { useEffect, useState } from 'https://esm.sh/react@18.2.0';

const Articles = () => {
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		fetch('http://localhost:8000/read')
			.then((response) => response.json())
			.then((data) => setArticles(data.data));
	}, []);


	const deleteArticle = (id: string) => {
		fetch(`http://localhost:8000/delete/${id}`, {
			method: 'DELETE',
		});
		const newArticles = articles.filter((article: any) => article.id !== id);
		setArticles(newArticles);
	};

	const updateArticle = async (id: string) => {
		const name = prompt('Update name');
		const formData = {
			name,
		};
		const res = await fetch(`http://localhost:8000/update/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});
		const data = await res.json();
		// create optimistic update, this is temp
		window.location.reload(true);
	};

	const renderArticles = (articles: any) => {
		return (
			<>
				<h1>Articles</h1>
				<ul>
					{articles.map((article: any) => (
						<li>
							<h2>{article.name}</h2>
							<p>{article.content}</p>
							<p>{article.created_at}</p>
							<button onClick={() => deleteArticle(article.id)}>Delete article</button> <br />
							<button onClick={() => updateArticle(article.id)}>Update article</button>
						</li>
					))}
				</ul>
			</>
		);
	};

	return (
		<>
		{articles.length > 0 ? renderArticles(articles) : <p>Loading...</p>}
		</>
	);
};

export default Articles;
