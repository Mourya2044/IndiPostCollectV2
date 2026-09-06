import React, { useEffect } from 'react'
import CommunityPostCard from '../community/CommunityPostCard'
import { useFetchInfinitePostsofUser } from '@/queries/postsQuery.js';
import { useInView } from 'react-intersection-observer';
import { Loader2, MessageSquare } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';

const ProfilePosts = () => {
  const { user } = useAuthStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useFetchInfinitePostsofUser(user?._id);
  const { ref: loadingRef, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="border border-border bg-background p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-IPCprimary" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Loading Posts…</p>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 border border-border bg-IPCsecondary/10 text-sm text-IPCsecondary">Error: {error.message}</div>;
  }

  const isEmpty = data?.pages?.[0]?.posts?.length === 0;

  return (
    <div className="border border-border bg-background flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-IPCprimary" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">My Posts</h2>
      </div>

      <div className="flex-1">
        {isEmpty ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            No posts yet. Share something with the community!
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-border">
            {data.pages.map((page) =>
              page.posts.map((post) => (
                <div key={post._id} className="bg-background p-4 sm:p-6">
                  <CommunityPostCard post_={post} />
                </div>
              ))
            )}
          </div>
        )}

        {hasNextPage && (
          <div ref={loadingRef} className="py-6 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin text-IPCprimary" /> Loading More…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePosts;