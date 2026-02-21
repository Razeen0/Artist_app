import api from './api';

export const AuthService = {
    login: async (credentials: any) => {
        const response = await api.post('/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            // Store only user info, not the token again
            const { token, ...userInfo } = response.data.data;
            localStorage.setItem('user', JSON.stringify(userInfo));
        }
        return response.data;
    },
    signup: async (userData: any) => {
        const response = await api.post('/signup', { user: userData });
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            // Server returns { user, token }. We store user.
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
