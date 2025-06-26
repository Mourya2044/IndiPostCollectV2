import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Send, Share2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/useAuthStore.js'
import { Link, useParams } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { axiosInstance } from '@/lib/axios.js'
import LoadingSpinner from '@/components/LoadingSpinner'

const formatTimeAgo = (isoDate) => {
  const now = new Date();
  const posted = new Date(isoDate);
  const diffInSeconds = Math.floor((now - posted) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions = [
    { value: 60, name: "second" },
    { value: 60, name: "minute" },
    { value: 24, name: "hour" },
    { value: 7, name: "day" },
    { value: 4.34524, name: "week" },
    { value: 12, name: "month" },
    { value: Infinity, name: "year" },
  ];

  let duration = diffInSeconds;
  for (let i = 0; i < divisions.length; i++) {
    if (Math.abs(duration) < divisions[i].value) {
      return rtf.format(Math.round(duration), divisions[i].name);
    }
    duration /= divisions[i].value;
  }
};



const CommunityPostPage = () => {
  const { user, hideFooter, unhideFooter } = useAuthStore();
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hideFooter();
    return () => unhideFooter();
  }, [unhideFooter, hideFooter]);

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      setPost(response.data);
      setComments([]);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  });

  const handleLike = () => {
    // Logic to handle like action
    if (post.likes.includes(user?.id)) {
      // If user already liked, remove like
      setPost(prevPost => ({
        ...prevPost,
        likes: prevPost.likes.filter(id => id !== user.id)
      }));
      console.log("Post unliked by user:", post.likes);

    } else {
      // If user hasn't liked, add like
      setPost(prevPost => ({
        ...prevPost,
        likes: [...prevPost.likes, user.id]
      }));
      console.log("Post liked by user:", post.likes);
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading community post..." />;
  }

  return (
    <Card className="m-2 p-4 shadow-none border-none rounded-none h-[90dvh]">
      <div className="flex gap-2 items-center">
        <div className="flex flex-col gap-2 items-center w-full flex-3/4">
          <CardHeader className="flex gap-4 w-full items-center">
            <Avatar className={"shrink-0 size-10"}>
              <AvatarImage
                src={post.user.avatar}
                alt={`@${post.user.name}`}
                className="object-cover rounded-full"
              />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <CardTitle>{post.user.name}</CardTitle>
              <CardDescription>
                {post.title}
              </CardDescription>
              <p className="text-xs text-muted-foreground">
                {`Posted ${formatTimeAgo(post.createdAt)}`}
              </p>
            </div>
          </CardHeader>
          <Separator />
          {post.images.length > 0 ? (
            <Carousel className="w-full h-full flex-3/4 p-2">
              <CarouselContent className={`flex gap-2 w-full h-full items-center ${post.images.length <= 1 ? "justify-center" : ""}`}>
                {post.images.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-auto lg:basis-auto">
                    <div className="p-1 h-full relative flex items-center justify-center bg-gray-200/45 rounded-lg overflow-hidden">
                      <Badge variant="secondary" className="absolute top-2 right-2 z-10">
                        {index + 1} / {post.images.length}
                      </Badge>
                      <img src={image} className='object-fit rounded-md h-[70vh]' alt={`UI Shot ${index + 1}`} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious />
        <CarouselNext /> */}
            </Carousel>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50 rounded-lg">
              <CardDescription className="text-center text-base leading-relaxed max-w-md">
                {post.description}
              </CardDescription>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1/4 p-2 h-full border-l border-gray-200">
          <div className="flex flex-col gap-2">
            {post.images.length > 0 && (
              <CardDescription className="text-sm text-muted-foreground">
                {post.description}
              </CardDescription>
            )}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
                <Heart
                  className={`text-red-500 size-5 ${post.likes.includes(user?.id) ? "fill-red-500" : ""}`}
                  onClick={handleLike}
                />
                <Label>Likes {post.likes.length}</Label>
              </div>
              <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
                <Share2 className="size-5" />
                <Label>Share</Label>
              </div>
            </div>
            <Separator />
          </div>

          {/* Comments Section */}
          <ScrollArea id="comments-section" className="h-[60vh] w-full">
            {comments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {/* Comments */}
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-3 items-start p-2 border-b border-gray-100">
                    <Avatar className="size-8">
                      <AvatarImage src={comment.user.avatar} className="object-cover rounded-full" />
                      <AvatarFallback>{comment.user.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{comment.user.name}</p>
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.time)}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </ScrollArea>

          {/* Comment Input */}
          <div className="flex flex-col gap-2">
            <Separator />
            <div className="flex w-full gap-2">
              <Input placeholder="Add a comment..." />
              <Button type="submit"><Send />Post</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CommunityPostPage