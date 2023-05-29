import React, { useEffect } from 'https://esm.sh/v118/@types/react@18.2.6';
import {
	Routes,
	Route,
	Link,
	BrowserRouter,
} from 'https://esm.sh/react-router-dom@6.11.2';
import ProtectedRoute from './pages/ProtectedRoute.tsx';
import Dashboard from './pages/Dashboard.tsx';
import { isLoggedIn } from './utils/user.ts';
import Articles from './pages/Articles.tsx';
import Home from './pages/Home.tsx';

type User = {
	id: string;
	name: string;
};

export function App(props: any) {
	const loggedIn = isLoggedIn();
	return (
		<>
			{!loggedIn ? (
				<a href='http://localhost:8000'>Continue with GitHub</a>
			) : (
				<Routes>
					<Route
						path='/'
						element={
							<ProtectedRoute isLoggedIn={loggedIn}>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/articles'
						element={
							<ProtectedRoute isLoggedIn={loggedIn}>
								<Articles />
							</ProtectedRoute>
						}
					/>
				</Routes>
			)}
		</>
	);
}

export const Navigation = () => {
	return (
		<nav>
			<Link to='/dashboard'>Dashboard</Link>
			<Link to='/articles'>Articles</Link>
		</nav>
	);
};

export default App;
