import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dot, EllipsisVertical, Heart, MessageCircle, Share2, Trash } from 'lucide-react'
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
import { axiosInstance } from '@/lib/axios.js'
import { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { toast } from 'sonner'

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

const CommunityPostCard = ({ post_ }) => {
  const { user } = useAuthStore();

  // console.log("Post Card Rendered", post);
  // console.log("User Details", user);
  

  const [post, setPost] = useState(post_);

  useEffect(() => {
    setPost(post_);
  }, [post_]);

  const handleLike = async () => {
    try {
      const response = await axiosInstance.put(`/posts/like/${post._id}`);
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.post.likes, // Assuming the response contains the updated likes array
      }));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting the post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  }

  if (!post) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }


  return (
    <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className={"flex gap-4 items-center"}>
        <Avatar className={"shrink-0 size-10"}>
          <AvatarImage
            src={post.userId.profilePic}
            alt={`@${post.userId.fullName}`}
            className="object-cover rounded-full"
          />
          <AvatarFallback>{post.userId.fullName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle>{post.userId.fullName}</CardTitle>
          <CardTitle className="font-medium">
            {post.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {`Posted ${formatTimeAgo(post.createdAt)}`}
          </p>
        </div>
        {user._id == post.userId._id && (
          <DropdownMenu className="flex-1 justify-end ml-auto">
            <DropdownMenuTrigger asChild className="ml-auto">
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <Separator />
      {post.images.length > 0 && (
        <>
          <Carousel className="w-full">
            <CarouselContent className={`flex gap-2 w-full h-full items-center ${post.images.length <= 1 ? "justify-center" : ""}`}>
              {post.images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-auto lg:basis-auto">
                  <div className="p-1 h-full w-fit relative flex items-center justify-center bg-gray-200/45 rounded-lg overflow-hidden">
                    <Badge variant="secondary" className="absolute top-2 right-2 z-10">
                      {index + 1} / {post.images.length}
                    </Badge>
                    <img src={image} className='object-fit rounded-md h-[40vh]' alt={`UI Shot ${index + 1}`} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious />
        <CarouselNext /> */}
          </Carousel>
          <Separator />
        </>
      )}
      <CardDescription className="text-sm text-muted-foreground">
        {post.description}
      </CardDescription>
      <CardFooter className="flex items-start gap-4">
        <div className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer">
          <Heart
            className={`text-red-500 size-5 ${post.likes.includes(user._id) ? "fill-red-500" : ""}`}
            onClick={handleLike}
          />
          <Label>Likes {post.likes.length}</Label>
        </div>
        <Link
          className="flex items-center justify-center my-auto gap-1 rounded-full hover:bg-gray-500/10 px-2 py-1 transition-colors duration-300 cursor-pointer"
          to={`/community/${post._id}`}
        >
          <MessageCircle className="size-5" />
          <Label>Comments {post.comments}</Label>
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