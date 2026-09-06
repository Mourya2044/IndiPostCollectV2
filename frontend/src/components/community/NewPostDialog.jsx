import { useRef, useState } from "react"
import {
  Dialog, DialogClose, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"
import { Loader, PlusSquareIcon, Trash2, X, ImagePlus, FileText } from "lucide-react"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios.js"

const NewPostDialog = () => {
  const inputRef = useRef(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    Promise.all(files.map(fileToBase64))
      .then((base64Images) => setImages((prev) => [...prev, ...base64Images]))
      .catch((err) => console.error("Error uploading images:", err))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    if (!title.trim()) { toast.error("Title is required"); setUploading(false); return }
    try {
      await axiosInstance.post("/posts", { title: title.trim(), description: description.trim(), images })
      setTitle(""); setDescription(""); setImages([])
      setOpen(false)
      toast.success("Post published!")
    } catch (err) {
      console.error("Error creating post:", err)
      toast.error("Failed to create post.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity">
          <PlusSquareIcon className="h-3.5 w-3.5" /> New Post
        </button>
      </DialogTrigger>

      <DialogContent className="bg-background border border-border max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-base font-semibold text-IPCprimary tracking-tight">
            Create Post
          </DialogTitle>
          <p className="text-xs text-muted-foreground">Share your thoughts with the collector community.</p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3 w-3" /> Title <span className="text-IPCsecondary">*</span>
            </label>
            <textarea
              placeholder="Enter a clear, descriptive title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border focus:outline-none focus:border-IPCprimary focus:ring-1 focus:ring-IPCprimary resize-none transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea
              placeholder="Tell the story behind this post…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border focus:outline-none focus:border-IPCprimary focus:ring-1 focus:ring-IPCprimary resize-none transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <ImagePlus className="h-3 w-3" /> Images
            </label>
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border text-xs text-muted-foreground hover:border-IPCprimary hover:text-IPCprimary transition-all"
            >
              <ImagePlus className="h-4 w-4" /> Click to add images
            </button>
            <input ref={inputRef} type="file" onChange={handleImageUpload} multiple className="hidden" accept="image/*" />
          </div>

          {/* Preview */}
          {images.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Preview ({images.length} image{images.length > 1 ? 's' : ''})
                </span>
                <button onClick={() => setImages([])} className="text-[10px] text-IPCsecondary hover:underline">Remove all</button>
              </div>
              <Carousel className="w-full">
                <CarouselContent className={`flex gap-2 items-center ${images.length <= 1 ? "justify-center" : ""}`}>
                  {images.map((image, index) => (
                    <CarouselItem key={index} className="basis-auto">
                      <div className="relative border border-border overflow-hidden">
                        <button
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute top-1.5 right-1.5 z-10 p-1 bg-IPCsecondary text-white hover:opacity-90 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <img src={image} className="h-28 object-cover" alt={`Preview ${index + 1}`} />
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/50 text-white text-[9px]">
                          {index + 1}/{images.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border flex gap-3">
          <DialogClose asChild>
            <button className="flex-1 py-2.5 border border-border text-xs font-semibold uppercase tracking-widest text-foreground hover:border-IPCsecondary hover:text-IPCsecondary transition-all">
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 py-2.5 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading && <Loader className="h-3.5 w-3.5 animate-spin" />}
            {uploading ? "Publishing…" : "Publish Post"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewPostDialog