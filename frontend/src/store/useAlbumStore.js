import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'sonner';

export const useAlbumStore = create((set, get) => ({
    album: [],
    stats: {
        totalStamps: 0,
        totalEstimatedValue: 0,
        uniqueThemes: 0,
        earliestYear: 'N/A',
        latestYear: 'N/A',
        eraBreakdown: {}
    },
    isLoading: false,

    fetchAlbum: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/album');
            set({
                album: res.data.album || [],
                stats: res.data.stats || get().stats
            });
        } catch (error) {
            console.error('Error fetching album:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    isMounted: (stampId) => {
        if (!stampId) return false;
        const idStr = stampId.toString();
        return get().album.some(item => item.stamp && (item.stamp._id || item.stamp).toString() === idStr);
    },

    mountStamp: async (stampId, notes = '', source = 'Collector Mount') => {
        try {
            const res = await axiosInstance.post('/album/mount', { stampId, notes, source });
            toast.success('Stamp mounted into your virtual album!');
            await get().fetchAlbum();
            return res.data;
        } catch (error) {
            console.error('Error mounting stamp:', error);
            toast.error(error.response?.data?.message || 'Failed to mount stamp');
            throw error;
        }
    },

    updateNotes: async (stampId, notes) => {
        try {
            await axiosInstance.patch(`/album/notes/${stampId}`, { notes });
            toast.success('Album notes updated');
            // Update local state
            set(state => ({
                album: state.album.map(item => {
                    if (item.stamp && (item.stamp._id || item.stamp).toString() === stampId.toString()) {
                        return { ...item, notes };
                    }
                    return item;
                })
            }));
        } catch (error) {
            console.error('Error updating album notes:', error);
            toast.error('Failed to update notes');
        }
    },

    unmountStamp: async (stampId) => {
        try {
            await axiosInstance.delete(`/album/unmount/${stampId}`);
            toast.success('Stamp unmounted from album');
            await get().fetchAlbum();
        } catch (error) {
            console.error('Error unmounting stamp:', error);
            toast.error('Failed to unmount stamp');
        }
    }
}));
