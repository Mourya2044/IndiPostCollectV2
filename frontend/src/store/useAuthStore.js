import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
//import { tr } from 'date-fns/locale.js';

export const useAuthStore = create((set) => ({
    user: null,
    isCheckingAuth: true,
    isLoading: false,
    showNav: true,
    showFooter: true,

    hideNav: () => { set({ showNav: false }) },
    unhideNav: () => { set({ showNav: true }) },
    hideFooter: () => { set({ showFooter: false }) },
    unhideFooter: () => { set({ showFooter: true }) },

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/checkauth');
            set({ user: response.data })
        } catch (error) {
            console.error("No user found:", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            set({ user: response.data });
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    signup: async (userData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post('/auth/signup', userData);
            set({ user: response.data });
        } catch (error) {
            console.error("Error signing up:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await axiosInstance.post('/auth/logout');
            set({ user: null });
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    getUserInfo: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get('/auth/me');
            set({ user: response.data });
        } catch (error) {
            console.error("Error fetching user info:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfilePic: async (image) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.patch('/auth/profile-pic', { image });
            set({ user: response.data.user });
        } catch (error) {
            console.error("Error updating profile pic:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    forgetPassword: async (email) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post('/auth/forget-password', { email });
            set({ user: response.data.user });
        } catch (error) {
            console.error('Error forget password')
        } finally {
            set({ isLoading: false });
        }
    },

    resetPassword: async (password, token) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
            set({ user: response.data.user });
        } catch (error) {
            console.error('Error forget password')
        } finally {
            set({ isLoading: false });
        }
    },

    updateAddress: async (address) => {
        set({ isLoading: true });
        try {
            console.log("Updating address with data:", address);

            const response = await axiosInstance.patch('/auth/update-address', { address });
            console.log("Address updated successfully:", response.data);
            
            set({ user: response.data.user });
        } catch (error) {
            console.error("Error updating address:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}))
