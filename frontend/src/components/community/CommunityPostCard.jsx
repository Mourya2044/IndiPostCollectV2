import React, { useState } from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Label } from '../ui/label'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useAuthStore } from '@/store/useAuthStore.js'
import { Link } from 'react-router-dom'

const CommunityPostCard = () => {
  const { user } = useAuthStore()


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
    postedDate: "June 25, 2025",
    images: [
      "https://placehold.co/600x400?text=UI+Shot+1",
      "https://placehold.co/500x300?text=UI+Shot+2",
      "https://placehold.co/500x400?text=UI+Shot+3",
      "https://placehold.co/200x400?text=UI+Shot+4",
      "https://placehold.co/600x400?text=UI+Shot+5",
    ],
    stats: {
      likes: [user?.id],
      comments: 34,
    },
  }

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
    <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300 max-h-xs">
      <CardHeader className={"flex gap-4"}>
        <Avatar className={"shrink-0 size-10"}>
          <AvatarImage
            src={post.user.avatar}
            alt={`@${post.user.name}`}
            className="object-cover rounded-full"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            {post.description}
          </CardDescription>
          <p className="text-xs text-muted-foreground">
            {`Posted on ${post.postedDate}`}
          </p>
        </div>
      </CardHeader>
      <Separator />
      <Carousel className="w-full">
        <CarouselContent>
          {post.images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-auto lg:basis-auto">
              <div className="p-1 h-full w-fit relative flex items-center justify-center bg-gray-200/45 rounded-lg overflow-hidden">
                <Badge variant="secondary" className="absolute top-2 right-2 z-10">
                  {index + 1} / {post.images.length}
                </Badge>
                <img src={image} className='object-cover rounded-md' alt={`UI Shot ${index + 1}`} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
      <Separator />
      <CardFooter className="flex items-start gap-4">
        <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
          <Heart
            className={`text-red-500 size-5 ${post.stats.likes.includes(user?.id) ? "fill-red-500" : ""}`}
            onClick={handleLike}
          />
          <Label>Likes {post.stats.likes.length}</Label>
        </div>
        <Link
          className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer"
          to={`/community/${post.id}`}
        >
          <MessageCircle className="size-5" />
          <Label>Comments {post.stats.comments}</Label>
        </Link>
        <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
          <Share2 className="size-5" />
          <Label>Share</Label>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CommunityPostCard