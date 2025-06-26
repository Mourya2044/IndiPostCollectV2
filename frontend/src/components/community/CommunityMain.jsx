import React, { useEffect, useState } from 'react'
import CommunityHeader from './CommunityHeader';
import CommunityPostCard from './CommunityPostCard';
import { axiosInstance } from '@/lib/axios.js';
import LoadingSpinner from '../LoadingSpinner';


const CommunityMain = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();

    return () => {
      setPosts([]);
      setLoading(true);
    }
  }, [])

  if (loading) {
    return <LoadingSpinner message="Loading community posts..." />;
  }

  return (
    <div>
      <CommunityHeader />

      <div className="flex flex-col gap-4 p-4">
        {posts.map((post) => (
          <CommunityPostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default CommunityMain