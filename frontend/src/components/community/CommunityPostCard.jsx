import React from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Label } from '../ui/label'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'

const CommunityPostCard = () => {
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
      likes: 120,
      comments: 34,
    },
  }


  return (
    <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300 max-h-xs">
      <CardHeader className={"flex gap-4"}>
        <Avatar className={"shrink-0 size-10"}>
          <AvatarImage
            src={dummyPost.user.avatar}
            alt={`@${dummyPost.user.name}`}
            className="object-cover rounded-full"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle>{dummyPost.title}</CardTitle>
          <CardDescription>
            {dummyPost.description}
          </CardDescription>
          <p className="text-xs text-muted-foreground">
            {`Posted on ${dummyPost.postedDate}`}
          </p>
        </div>
      </CardHeader>
      <Separator />
      <Carousel className="w-full">
        <CarouselContent>
          {dummyPost.images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-auto lg:basis-auto">
              <div className="p-1 h-full w-fit relative flex items-center justify-center bg-gray-200/45 rounded-lg overflow-hidden">
                <Badge variant="secondary" className="absolute top-2 right-2 z-10">
                  {index + 1} / {dummyPost.images.length}
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
          <Heart className="text-red-500 size-5 fill-red-500" />
          <Label>Likes {dummyPost.stats.likes}</Label>
        </div>
        <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
          <MessageCircle className="size-5" />
          <Label>Comments {dummyPost.stats.comments}</Label>
        </div>
        <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
          <Share2 className="size-5" />
          <Label>Share</Label>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CommunityPostCard