import React, { useCallback, useEffect, useState } from 'react'
import CommunityHeader from './CommunityHeader';
import CommunityPostCard from './CommunityPostCard';
import { axiosInstance } from '@/lib/axios.js';
import LoadingSpinner from '../LoadingSpinner';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';


const CommunityMain = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref: loadingRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          page,
          limit: 10,
        },
      });

      if (response.data.length < 10) {
        setHasMore(false);
      }

      // Append new posts
      setPosts((prevPosts) => [ ...prevPosts, ...response.data]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);


  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (inView && hasMore) {
      fetchPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasMore]);

  if (loading) {
    return <LoadingSpinner message="Loading community posts..." />;
  }

  return (
    <div>
      <CommunityHeader />

      <div className="flex flex-col gap-4 p-4">
        {posts.map((post) => (
          <CommunityPostCard key={post._id} post_={post} />
        ))}
      </div>
      {hasMore && <div ref={loadingRef} className="flex justify-center items-center p-4">
        {inView && (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-600 text-lg">Loading more posts...</p>
          </div>
        )}
      </div>}
    </div>
  )
}

export default CommunityMain