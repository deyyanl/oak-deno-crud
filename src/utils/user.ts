import jwt_decode from 'jwt-decode';

export const setUser = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const jwt = urlParams.get('code');
	if (jwt) sessionStorage.setItem('jwt', jwt);
	return;
};

export const isLoggedIn = () => {
	const jwt = sessionStorage.getItem('jwt');
	if (!jwt) setUser();
	return !!jwt;
};

export const retrieveUser = (): any => {
	const jwt = sessionStorage.getItem('jwt');
	if (!jwt) return;
	return jwt_decode(jwt);
};
