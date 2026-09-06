import React, { useEffect } from 'react'
import CommunityHeader from './CommunityHeader'
import CommunityPostCard from './CommunityPostCard'
import { useInView } from 'react-intersection-observer'
import { Loader2, MessageSquare } from 'lucide-react'
import { useFetchInfinitePosts } from '@/queries/postsQuery.js'

const CommunityMain = () => {
  const {
    data, fetchNextPage, hasNextPage,
    isFetchingNextPage, isLoading, isError, error
  } = useFetchInfinitePosts()

  const { ref: loadingRef, inView } = useInView({ threshold: 0.1 })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const isEmpty = data?.pages?.[0]?.posts?.length === 0

  return (
    <div className="flex flex-col h-full">
      <CommunityHeader />

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-IPCprimary" />
            <span className="text-xs uppercase tracking-widest">Loading posts…</span>
          </div>
        )}

        {isError && (
          <div className="max-w-xl mx-auto m-6 px-4 py-3 border border-IPCsecondary/30 bg-IPCsecondary/5 text-sm text-IPCsecondary">
            Error loading posts: {error?.message}
          </div>
        )}

        {!isLoading && isEmpty && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-14 h-14 border border-border flex items-center justify-center text-muted-foreground">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No posts yet</p>
              <p className="text-xs text-muted-foreground mt-1">Be the first to share something with the community.</p>
            </div>
          </div>
        )}

        {!isLoading && !isEmpty && (
          <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-px bg-border">
            {data.pages.map((page) =>
              page.posts.map((post) => (
                <div key={post._id} className="bg-background">
                  <CommunityPostCard post_={post} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {hasNextPage && (
          <div ref={loadingRef} className="flex justify-center py-6">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-IPCprimary" />
                <span className="uppercase tracking-widest">Loading more…</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityMain
