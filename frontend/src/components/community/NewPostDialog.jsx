import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Badge, Loader, PlusSquareIcon, Trash, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios.js"

const NewPostDialog = () => {
  const inputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(fileToBase64))
      .then((base64Images) => {
        setImages((prev) => [...prev, ...base64Images]);
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    if (!title.trim()) {
      toast.error("Title is required");
      setUploading(false);
      return;
    }

    const postData = {
      title: title.trim(),
      description: description.trim(),
      images: images,
    };
    console.log("Post Data:", postData);

    // API CALL
    try {
      const response = await axiosInstance.post("/posts", postData);
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
      setUploading(false);
      return;      
    }

    setTitle("");
    setDescription("");
    setImages([]);
    setUploading(false);
    setOpen(false);
    toast.success("Post created successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">New Post</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts and ideas with the community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Textarea id="title" name="title" placeholder="Enter post title" onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Enter post description" onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex flex-col w-full gap-3">
            <Label htmlFor="picture">Add Images</Label>
            <Button onClick={() => inputRef.current.click()} className="mx-auto w-full">
              <PlusSquareIcon className="size-4" />
              <span>Add Images</span>
            </Button>
            <Input id="picture" type="file" ref={inputRef} onChange={handleImageUpload} multiple className="hidden" />
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="picture">Preview</Label>
            <div className="flex gap-2">
              {images.length > 0 ? (
                <Carousel className="w-full h-full p-2">
                  <CarouselContent className={`flex gap-2 w-full h-full items-center ${images.length <= 1 ? "justify-center" : ""}`}>
                    {images.map((image, index) => (
                      <CarouselItem key={index} className="basis-auto">
                        <div className="p-1 h-full relative flex items-center justify-center bg-gray-200/45 rounded-lg overflow-hidden">
                          <Button variant="destructive" className="absolute top-2 right-2 z-10" onClick={() => setImages(images.filter((_, i) => i !== index))}>
                            <Trash2 className="size-4" />
                          </Button>
                          <img src={image} className='object-fit rounded-md h-[30vh]' alt={`UI Shot ${index + 1}`} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* <CarouselPrevious />
                    <CarouselNext /> */}
                </Carousel>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50 rounded-lg">
                  <p className="text-center text-base leading-relaxed max-w-md">
                    No images uploaded yet. Please select images to preview them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading && <Loader className="animate-spin" />}
            {uploading ? "Posting..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewPostDialog