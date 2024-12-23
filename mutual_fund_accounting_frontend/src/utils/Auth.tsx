export default class Auth {
	static getAccessToken() {
		const token = localStorage.getItem('access_token');
		return token;
	}
}