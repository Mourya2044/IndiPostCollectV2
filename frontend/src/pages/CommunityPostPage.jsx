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
import { Link } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

  useEffect(() => {
    hideFooter();
    return () => unhideFooter();
  }, [unhideFooter, hideFooter]);


  const dummyPost = {
    id: "post_12345",
    user: {
      name: "Evelyn Rabbit",
      avatar: "https://github.com/evilrabbit.png",
      fallback: "ER",
    },
    title: "Exploring the Beauty of Minimal UI Design",
    description:
      "Minimalism is not just a design trend but a philosophy. This post explores how less can be more in UI/UX.",
    postedDate: "2025-06-24T09:00:00Z",
    images: [
      "https://placehold.co/800x800?text=UI+Shot+1",
      "https://placehold.co/500x300?text=UI+Shot+2",
      "https://placehold.co/500x400?text=UI+Shot+3",
      "https://placehold.co/200x400?text=UI+Shot+4",
      "https://placehold.co/600x400?text=UI+Shot+5",
    ],
    stats: {
      likes: [user?.id], // array of user IDs
      comments: [
        {
          user: {
            name: "Alice Johnson",
            avatar: "https://i.pravatar.cc/40?img=1",
            fallback: "AJ"
          },
          text: "This design is stunning!",
          time: "2025-06-26T14:30:00Z"
        },
        {
          user: {
            name: "Bob Smith",
            avatar: "https://i.pravatar.cc/40?img=2",
            fallback: "BS"
          },
          text: "I appreciate the clean layout!",
          time: "2025-06-26T12:15:00Z"
        },
        {
          user: {
            name: "Charlie Adams",
            avatar: "https://i.pravatar.cc/40?img=3",
            fallback: "CA"
          },
          text: "Can you share the design file?",
          time: "2025-06-25T18:45:00Z"
        },
        {
          user: {
            name: "Diana Park",
            avatar: "https://i.pravatar.cc/40?img=4",
            fallback: "DP"
          },
          text: "Super useful, thank you!",
          time: "2025-06-24T09:00:00Z"
        },
      ]

    },
  };


  const [post, setPost] = useState(dummyPost);

  const handleLike = () => {
    // Logic to handle like action
    if (post.stats.likes.includes(user?.id)) {
      // If user already liked, remove like
      setPost(prevPost => ({
        ...prevPost,
        stats: {
          ...prevPost.stats,
          likes: prevPost.stats.likes.filter(id => id !== user.id)
        }
      }));
      console.log("Post unliked by user:", post.stats.likes);

    } else {
      // If user hasn't liked, add like
      setPost(prevPost => ({
        ...prevPost,
        stats: {
          ...prevPost.stats,
          likes: [...prevPost.stats.likes, user.id]
        }
      }));
      console.log("Post liked by user:", post.stats.likes);
    }
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
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <CardTitle>{post.user.name}</CardTitle>
              <CardDescription>
                {post.title}
              </CardDescription>
              <p className="text-xs text-muted-foreground">
                {`Posted ${formatTimeAgo(post.postedDate)}`}
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
                  className={`text-red-500 size-5 ${post.stats.likes.includes(user?.id) ? "fill-red-500" : ""}`}
                  onClick={handleLike}
                />
                <Label>Likes {post.stats.likes.length}</Label>
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
            {post.stats.comments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {/* Comments */}
                {post.stats.comments.map((comment, index) => (
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