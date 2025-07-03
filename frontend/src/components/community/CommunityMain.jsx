import React, { useEffect } from 'react';
import CommunityHeader from './CommunityHeader';
import CommunityPostCard from './CommunityPostCard'; // ✅ make sure this is the correct component
import LoadingSpinner from '../LoadingSpinner';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { useFetchInfinitePosts } from '@/queries/postsQuery.js';

const CommunityMain = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useFetchInfinitePosts();

  const { ref: loadingRef, inView } = useInView({
    threshold: 0.1,
  });

  // Debug logs
  // useEffect(() => {
  //   console.log("isLoading:", isLoading);
  //   console.log("isError:", isError);
  //   console.log("error:", error);
  //   console.log("data:", data);
  // }, [data, isLoading, isError, error]);

  // Trigger next page when inView
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner message="Loading community posts..." />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 text-red-500" />
        <p className="text-red-600 text-lg">Error loading posts. Please try again later.</p>
        <p className="text-gray-600 text-sm">{error?.message}</p>
      </div>
    );
  }

  // Optional: Handle empty data
  const isEmpty = data?.pages?.[0]?.posts?.length === 0;

  return (
    <div>
      <CommunityHeader />

      <div className="flex flex-col gap-4 p-4">
        {isEmpty ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
        ) : (
          data.pages.map((page) =>
            page.posts.map((post) => (
              console.log("Rendering post:", post),
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
    </div>
  );
};

export default CommunityMain;
