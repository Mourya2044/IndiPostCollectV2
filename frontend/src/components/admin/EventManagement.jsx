import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit2, Trash2, Users, Plus } from "lucide-react";

const EventManagement = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    regexsearch: "",
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    date: "",
    createdBy: "",
  });
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      date: "",
      createdBy: "",
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/events", { params: filters });
        setData(res.data);
      } catch (err) {
        toast.error("Failed to fetch events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const createEvent = async () => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        image: formData.image, // base64 or cloudinary URL
        date: formData.date,
      };

      const res = await axiosInstance.post("/events/setup", payload);
      toast.success("Event created");
      setIsDialogOpen(false);
      resetForm();
      setFilters({ ...filters }); // to refetch list
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      toast.success("Event deleted");
      setFilters({ ...filters }); // refetch
    } catch (error) {
      toast.error("Failed to delete event");
      console.error(error);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, data?.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(data?.totalPages, startPage + maxVisiblePages - 1);

    if (data.page > 1) {
      items.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setFilters((prev) => ({ ...prev, page: data.page - 1 }));
            }}
          />
        </PaginationItem>
      );
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setFilters({ ...filters, page: 1 });
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === data?.page}
            onClick={(e) => {
              e.preventDefault();
              setFilters({ ...filters, page: i });
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < data?.totalPages) {
      if (endPage < data?.totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={data?.totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setFilters({ ...filters, page: data?.totalPages });
            }}
          >
            {data?.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (data?.page < data?.totalPages) {
      items.push(
        <PaginationItem key="next">
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setFilters((prev) => ({ ...prev, page: data.page + 1 }));
            }}
          />
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Search + Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Events</h2>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search events..."
            value={filters.regexsearch}
            onChange={(e) =>
              setFilters({ ...filters, page: 1, regexsearch: e.target.value })
            }
            className="w-64"
          />
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl bg-white rounded-xl shadow-2xl">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-bold text-gray-800">
                    Add New Event
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="date"
                        className="text-sm font-medium text-gray-700"
                      >
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="mt-1 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="image"
                      className="text-sm font-medium text-gray-700"
                    >
                      Upload Image
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setFormData({ ...formData, image: reader.result });
                        if (file) reader.readAsDataURL(file);
                      }}
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Event Preview"
                        className="mt-2 w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      onClick={async () => {
                        await createEvent();
                        setIsDialogOpen(false);
                      }}
                    >
                      Create
                    </Button>
                    
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <p className="text-center text-muted-foreground">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.events?.map((event) => (
            <Card key={event._id}>
              <CardContent className="p-4 space-y-2">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Calendar className="w-12 h-12 m-auto text-gray-400" />
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold truncate">{event.title}</h3>
                  <Badge variant="secondary">{event.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {event.registered} / {event.capacity} registered
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
