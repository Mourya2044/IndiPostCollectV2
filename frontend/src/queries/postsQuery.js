// postsQuery.js
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.js';

const fetchPosts = async ({ pageParam = 1 }) => {
  const res = await axiosInstance.get('/posts', {
    params: { page: pageParam },
  });
  return res.data; // ✅ FIXED
};

export const useFetchInfinitePosts = () =>
  useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
