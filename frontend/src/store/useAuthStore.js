import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useAuthStore = create((set) => ({
    user: null,
    isCheckingAuth: true,
    isLoading: false,
    showNav: true,

    hideNav: () => {set({showNav: false})},
    unhideNav: () => {set({showNav: true})},

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/checkauth');
            set({user: response.data})
        } catch (error) {
            console.error("Error in auth", error);
        } finally {
            set({isCheckingAuth: false});
        }
    },

    login: async (email, password) => {
        set({isLoading: true});
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            set({ user: response.data });
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            set({isLoading: false});
        }
    },

    signup: async (userData) => {
        set({isLoading: true});
        try {
            const response = await axiosInstance.post('/auth/signup', userData);
            set({ user: response.data.user });
        } catch (error) {
            console.error("Error signing up:", error);
        } finally {
            set({isLoading: false});
        }
    },

    logout: async () => {
        set({isLoading: true});
        try {
            await axiosInstance.post('/auth/logout');
            set({ user: null });
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            set({isLoading: false});
        }
    },

    getUserInfo: async () => {
        set({isLoading: true});
        try {
            const response = await axiosInstance.get('/auth/me');
            set({ user: response.data.user });
        } catch (error) {
            console.error("Error fetching user info:", error);
        } finally {
            set({isLoading: false});
        }
    },

}))
