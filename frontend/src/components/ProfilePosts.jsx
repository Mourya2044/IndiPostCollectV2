import React, { useEffect } from 'react'
import CommunityPostCard from './community/CommunityPostCard'
import { useFetchInfinitePostsofUser } from '@/queries/postsQuery.js';
import { useInView } from 'react-intersection-observer';
import { Loader2, MessageSquare } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ProfilePosts = () => {
  const { user } = useAuthStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useFetchInfinitePostsofUser(user?._id);

  const { ref: loadingRef, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner message="Loading your posts..." />;
  }

  if (isError) {
    return <div>Error loading posts: {error.message}</div>;
  }

  const isEmpty = data?.pages?.[0]?.posts?.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          My Posts
        </CardTitle>
      </CardHeader>
      <CardContent>

        {/* Posts List */}
        <div className="space-y-4">
          {isEmpty ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
          ) : (
            data.pages.map((page) =>
              page.posts.map((post) => (
                <CommunityPostCard key={post._id} post_={post} />
              ))
            )
          )}
        </div>
        {hasNextPage && (
          <div ref={loadingRef} className="flex justify-center items-center p-4">
            {isFetchingNextPage && (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600">Loading more posts...</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfilePosts