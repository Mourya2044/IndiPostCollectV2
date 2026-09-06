import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'sonner';

export const useWishlistStore = create((set, get) => ({
    wishlist: [],
    wishlistIds: [],
    isLoading: false,
    hasFetched: false,

    fetchWishlist: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/wishlist');
            const items = res.data.wishlist || [];
            set({
                wishlist: items,
                wishlistIds: items.map(item => (typeof item === 'string' ? item : item._id)),
                hasFetched: true
            });
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    isInWishlist: (stampId) => {
        if (!stampId) return false;
        const idStr = stampId.toString();
        return get().wishlistIds.some(id => id.toString() === idStr);
    },

    toggleWishlist: async (stamp) => {
        if (!stamp?._id) return;
        const stampId = stamp._id.toString();
        const { wishlistIds, wishlist } = get();
        const currentlyWishlisted = wishlistIds.some(id => id.toString() === stampId);

        // Optimistic UI update
        if (currentlyWishlisted) {
            set({
                wishlistIds: wishlistIds.filter(id => id.toString() !== stampId),
                wishlist: wishlist.filter(item => (item._id || item).toString() !== stampId)
            });
        } else {
            set({
                wishlistIds: [...wishlistIds, stampId],
                wishlist: [...wishlist, stamp]
            });
        }

        try {
            const res = await axiosInstance.post('/wishlist/toggle', { stampId });
            if (res.data.isWishlisted) {
                toast.success('Saved to your wishlist');
            } else {
                toast.info('Removed from wishlist');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            // Rollback optimistic state
            set({ wishlistIds, wishlist });
            toast.error(error.response?.data?.message || 'Please sign in to save items to your wishlist');
        }
    },

    removeFromWishlist: async (stampId) => {
        if (!stampId) return;
        const idStr = stampId.toString();
        const { wishlistIds, wishlist } = get();

        // Optimistic update
        set({
            wishlistIds: wishlistIds.filter(id => id.toString() !== idStr),
            wishlist: wishlist.filter(item => (item._id || item).toString() !== idStr)
        });

        try {
            await axiosInstance.delete(`/wishlist/${idStr}`);
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            set({ wishlistIds, wishlist });
            toast.error('Failed to remove item');
        }
    },

    moveToCart: async (stamp) => {
        if (!stamp?._id) return;
        const stampId = stamp._id.toString();
        try {
            await axiosInstance.post('/cart/add', { stampId, quantity: 1 });
            // Remove from wishlist
            await get().removeFromWishlist(stampId);
            toast.success(`"${stamp.title || 'Stamp'}" added to your cart!`);
        } catch (error) {
            console.error('Error moving item to cart:', error);
            toast.error('Failed to add item to cart');
        }
    }
}));
