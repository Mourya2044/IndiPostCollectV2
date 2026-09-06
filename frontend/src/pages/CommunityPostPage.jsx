import React, { useEffect, useState } from 'react'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EllipsisVertical, Heart, MessageCircle, Send, Share2, Trash, ArrowLeft, Loader2 } from 'lucide-react'
import {
  Carousel, CarouselContent, CarouselItem,
} from "@/components/ui/carousel"
import { useAuthStore } from '@/store/useAuthStore.js'
import { Link, useParams } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { axiosInstance } from '@/lib/axios.js'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const formatTimeAgo = (isoDate) => {
  const now = new Date()
  const posted = new Date(isoDate)
  const diffInSeconds = Math.floor((now - posted) / 1000)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const divisions = [
    { value: 60, name: "second" }, { value: 60, name: "minute" },
    { value: 24, name: "hour" }, { value: 7, name: "day" },
    { value: 4.34524, name: "week" }, { value: 12, name: "month" },
    { value: Infinity, name: "year" },
  ]
  let duration = diffInSeconds
  for (let i = 0; i < divisions.length; i++) {
    if (Math.abs(duration) < divisions[i].value) return rtf.format(Math.round(duration), divisions[i].name)
    duration /= divisions[i].value
  }
}

const CommunityPostPage = () => {
  const { user, hideFooter, unhideFooter } = useAuthStore()
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { hideFooter(); return () => unhideFooter() }, [hideFooter, unhideFooter])

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`)
      setPost(response.data)
      const commentResponse = await axiosInstance.get(`/posts/${postId}/comments`)
      setComments(commentResponse.data)
    } catch (err) {
      console.error("Error fetching post:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchPost() }, [postId])

  const handleLike = async () => {
    try {
      const response = await axiosInstance.put(`/posts/like/${post._id}`)
      setPost((prev) => ({ ...prev, likes: response.data.post.likes }))
    } catch (err) {
      toast.error("Failed to like post.")
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    const text = e.target[0].value.trim()
    if (!text) return
    try {
      await axiosInstance.put(`/posts/comment/${post._id}`, { text })
      const commentsResponse = await axiosInstance.get(`/posts/${post._id}/comments`)
      setComments(commentsResponse.data)
      e.target.reset()
      toast.success("Comment added!")
    } catch (err) {
      toast.error("Failed to submit comment.")
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/posts/${post._id}`)
      toast.success("Post deleted!")
    } catch (err) {
      toast.error("Failed to delete post.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-IPCprimary" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Loading post…</span>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
        <p className="text-sm text-muted-foreground">Post not found.</p>
        <Link to="/community" className="text-xs uppercase tracking-widest text-IPCprimary hover:underline">← Back to Community</Link>
      </div>
    )
  }

  const isLiked = post.likes.includes(user._id)
  const isOwner = user._id == post.userId._id

  return (
    <div className="h-[calc(100vh-4rem)] bg-background flex flex-col">

      {/* ── Top breadcrumb ── */}
      <div className="border-b border-border shrink-0">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link to="/community" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-IPCprimary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Community
          </Link>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <EllipsisVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-border">
                <DropdownMenuItem onClick={handleDelete} className="text-IPCsecondary focus:text-IPCsecondary cursor-pointer gap-2">
                  <Trash className="h-3.5 w-3.5" /> Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* Left: Post content */}
        <div className="flex-1 flex flex-col min-h-0 border-r border-border overflow-hidden">

          {/* Author */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
            <Avatar className="shrink-0 size-9 border border-border overflow-hidden rounded-full">
              <AvatarImage src={post.userId.profilePic} alt={post.userId.fullName} className="object-cover" />
              <AvatarFallback className="text-xs bg-IPCprimary/10 text-IPCprimary font-semibold">
                {post.userId.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.userId.fullName}</p>
              <p className="text-[10px] text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
            </div>
          </div>

          {/* Title */}
          <div className="px-5 pt-4 pb-3 shrink-0">
            <h1 className="text-lg font-semibold text-foreground leading-snug">{post.title}</h1>
          </div>

          {/* Images */}
          {post.images.length > 0 && (
            <div className="border-t border-b border-border bg-muted/20 overflow-hidden shrink-0">
              <Carousel className="w-full">
                <CarouselContent className={`flex gap-px items-center ${post.images.length <= 1 ? "justify-center" : ""}`}>
                  {post.images.map((image, index) => (
                    <CarouselItem key={index} className="basis-auto">
                      <div className="relative">
                        <img src={image} className="max-h-[55vh] object-cover" alt={`Image ${index + 1}`} />
                        {post.images.length > 1 && (
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[9px]">
                            {index + 1}/{post.images.length}
                          </span>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {/* Description */}
          {post.description && (
            <div className="px-5 py-4 border-b border-border">
              <div className="border-l-2 border-IPCsecondary pl-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 px-4 py-2 shrink-0">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                isLiked ? 'text-IPCsecondary' : 'text-muted-foreground hover:text-IPCsecondary'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-IPCsecondary' : ''}`} />
              {post.likes.length} likes
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> {post.comments} comments
            </span>
            <button className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-IPCprimary transition-colors">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>

        {/* Right: Comments */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col min-h-0 shrink-0">
          <div className="px-4 py-3 border-b border-border shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCprimary">Comments</p>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="divide-y divide-border">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                  <MessageCircle className="h-6 w-6 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">No comments yet. Start the discussion!</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="flex gap-3 px-4 py-3">
                    <Avatar className="shrink-0 size-7 border border-border overflow-hidden rounded-full mt-0.5">
                      <AvatarImage src={comment.userId.profilePic} className="object-cover" />
                      <AvatarFallback className="text-[10px] bg-IPCprimary/10 text-IPCprimary font-semibold">
                        {comment.userId.fullName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-xs font-semibold text-foreground">{comment.userId.fullName}</p>
                        <p className="text-[10px] text-muted-foreground">{formatTimeAgo(comment.createdAt)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Comment input */}
          <div className="border-t border-border shrink-0">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
              <input
                placeholder="Write a comment…"
                className="flex-1 px-4 py-3 text-sm bg-background outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="p-3 text-muted-foreground hover:text-IPCprimary transition-colors border-l border-border"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPostPage