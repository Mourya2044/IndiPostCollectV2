import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { Avatar } from '@radix-ui/react-avatar'
import { Heart, MessageCircle, Share2, EllipsisVertical, Trash } from 'lucide-react'
import {
  Carousel, CarouselContent, CarouselItem,
} from "@/components/ui/carousel"
import { useAuthStore } from '@/store/useAuthStore.js'
import { Link } from 'react-router-dom'
import { axiosInstance } from '@/lib/axios.js'
import { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { toast } from 'sonner'

const formatTimeAgo = (isoDate) => {
  const now = new Date()
  const posted = new Date(isoDate)
  const diffInSeconds = Math.floor((posted - now) / 1000)
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

const CommunityPostCard = ({ post_ }) => {
  const { user } = useAuthStore()
  const [post, setPost] = useState(post_)

  useEffect(() => { setPost(post_) }, [post_])

  const handleLike = async () => {
    try {
      const response = await axiosInstance.put(`/posts/like/${post._id}`)
      setPost((prev) => ({ ...prev, likes: response.data.post.likes }))
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/posts/${post._id}`)
      toast.success("Post deleted!")
    } catch (err) {
      console.error("Error deleting post:", err)
      toast.error("Failed to delete post.")
    }
  }

  if (!post) return null
  const isLiked = post.likes.includes(user._id)
  const isOwner = user._id == post.userId._id

  return (
    <article className="group bg-background border border-border hover:border-IPCprimary/30 transition-all duration-200 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Avatar className="shrink-0 size-9 border border-border overflow-hidden rounded-full">
          <AvatarImage src={post.userId.profilePic} alt={post.userId.fullName} className="object-cover" />
          <AvatarFallback className="text-xs bg-IPCprimary/10 text-IPCprimary font-semibold">
            {post.userId.fullName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{post.userId.fullName}</p>
          <p className="text-[10px] text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
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

      {/* ── Title ── */}
      <div className="px-4 pb-3">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-IPCprimary transition-colors">
          {post.title}
        </h3>
      </div>

      {/* ── Images ── */}
      {post.images.length > 0 && (
        <div className="border-t border-b border-border bg-muted/30">
          <Carousel className="w-full">
            <CarouselContent className={`flex gap-px items-center ${post.images.length <= 1 ? "justify-center" : ""}`}>
              {post.images.map((image, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <div className="relative">
                    <img
                      src={image}
                      className="max-h-72 object-cover"
                      alt={`Image ${index + 1}`}
                    />
                    {post.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-medium">
                        {index + 1} / {post.images.length}
                      </span>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      {/* ── Description ── */}
      {post.description && (
        <div className="px-4 py-3">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.description}</p>
        </div>
      )}

      {/* ── Footer Actions ── */}
      <div className="flex items-center gap-1 px-3 py-2 border-t border-border">
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
            isLiked ? 'text-IPCsecondary' : 'text-muted-foreground hover:text-IPCsecondary'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-IPCsecondary' : ''}`} />
          <span>{post.likes.length}</span>
        </button>

        <Link
          to={`/community/${post._id}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-IPCprimary transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments}</span>
        </Link>

        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-IPCprimary transition-colors ml-auto">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </article>
  )
}

export default CommunityPostCard