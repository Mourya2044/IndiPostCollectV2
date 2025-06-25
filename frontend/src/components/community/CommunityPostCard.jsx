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

const CommunityPostCard = () => {
  return (
    <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300 max-h-xs">
      <CardHeader className={"flex gap-4"}>
        <Avatar className={"shrink-0 size-10"}>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
            className="object-cover rounded-full"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle>{"Post Title"}</CardTitle>
          <CardDescription>
            {"Post description goes here. This is a brief overview of the post content, providing context and inviting users to engage."}
          </CardDescription>
          <p className="text-xs text-muted-foreground">
            {"Posted on March 15, 2023"}
          </p>
        </div>
      </CardHeader>
      <Separator />
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <img src="https://placehold.co/400.png" alt="image" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Separator />
      <CardFooter className="flex items-start gap-4">
        <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
          <Heart className="text-red-500 size-5 fill-red-500" />
          <Label>Likes {0}</Label>
        </div>
        <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
          <MessageCircle className="size-5" />
          <Label>Comments {0}</Label>
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