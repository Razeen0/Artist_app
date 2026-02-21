import api from './api';

export interface User {
    id: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

export const UserService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    updateUserStatus: async (id: string, status: string) => {
        const response = await api.patch(`/users/${id}`, { user: { status } });
        return response.data;
    }
};
