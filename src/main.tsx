import * as React from 'react';
import * as ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import App, { Navigation } from './App.tsx';
import './index.css';
import {
	createBrowserRouter,
	RouterProvider,
} from 'https://esm.sh/react-router-dom@6.11.2';
import Articles from './pages/Articles.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/articles',
		element: <Articles />,
	},
	{
		path: '/dashboard',
		element: <Dashboard />,
	},
	{
		path: '/login',
		element: <Login />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
