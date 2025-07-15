import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useStamps } from '@/queries/stampsQuery';
import { useQueryClient } from '@tanstack/react-query';

const StampsManagement = ({setStats}) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    search: '',
    regexsearch: '',
  });

  const { data, isFetching, error } = useStamps(filters);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (error) {
      console.error('Error fetching stamps:', error);
      toast.error('Failed to fetch stamps');
    }
    // console.log('Fetched data:', data);
    setStats((prev) => ({
      ...prev,
      totalItems: data?.totalItems || 0
    }));
  }, [data, error]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
    year: 0,
    price: 0,
    category: [],
    image: '',
    isForSale: false,
    isMuseumPiece: false,
    availableQuantity: 0,
  });

  const createItem = async (itemData) => {
    console.log('Creating item:', itemData);
    try {
      await axiosInstance.post('/stamps/new', itemData);
      queryClient.invalidateQueries(['stamps']);
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
    }
  };

  const updateItem = async (id, itemData) => {
    console.log('Updating item:', id, itemData);
    try {
      await axiosInstance.patch(`/stamps/${id}`, itemData);
      queryClient.invalidateQueries(['stamps']);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const deleteItem = async (id) => {
    console.log('Deleting item:', id);
    try {
      await axiosInstance.delete(`/stamps/${id}`);
      queryClient.invalidateQueries(['stamps']);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
      return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const itemData = {
        ...formData,
        price: parseInt(formData.price),
        availableQuantity: parseInt(formData.availableQuantity)
      };

      if (editingItem) {
        await updateItem(editingItem._id, itemData);
      } else {
        await createItem(itemData);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.imageUrl || '',
      country: item.country || '',
      year: item.year || 0,
      isForSale: item.isForSale || false,
      isMuseumPiece: item.isMuseumPiece || false,
      availableQuantity: item.availableQuantity || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const success = await deleteItem(id);
      if (success) {
        // If we deleted the last item on current page and it's not page 1, go to previous page
        if (items.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          loadItems(currentPage, itemsPerPage, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      country: '',
      year: 0,
      price: 0,
      category: [],
      image: '',
      isForSale: false,
      isMuseumPiece: false,
      availableQuantity: 0,
    });
    setEditingItem(null);
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      page: 1,
      // search: e.target.value,
      regexsearch: e.target.value,
    });
  };

  const handlePageChange = (page) => {
    setFilters({
      ...filters,
      page,
    });
  };

  const formatPrice = (price) => `₹${price.toLocaleString()}`;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setFormData({ ...formData, image: base64Image });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, data?.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(data?.totalPages, startPage + maxVisiblePages - 1);

    // Previous button
    if (data.page > 1) {
      items.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(data.page - 1);
            }}
          />
        </PaginationItem>
      );
    }

    // First page and ellipsis
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
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

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === data?.page}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page and ellipsis
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
              handlePageChange(data?.totalPages);
            }}
          >
            {data?.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    if (data?.page < data?.totalPages) {
      items.push(
        <PaginationItem key="next">
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(data?.page + 1);
            }}
          />
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Items Management</h2>
          <p className="text-muted-foreground">
            Manage your inventory and product catalog
            {data?.totalItems > 0 && (
              <span className="ml-2">({data.totalItems} total items)</span>
            )} 
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-white rounded-xl shadow-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category"
                    value={formData.category.map(cat => cat.trim()).join(', ')}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value.split(',').map(cat => cat.trim()) })}
                    className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                    Stock <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                    className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    id="isForSale"
                    type="checkbox"
                    checked={formData.isForSale}
                    onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="isForSale" className="text-sm font-medium text-gray-700 cursor-pointer">
                    For Sale
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    id="isMuseumPiece"
                    type="checkbox"
                    checked={formData.isMuseumPiece}
                    onChange={(e) => setFormData({ ...formData, isMuseumPiece: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="isMuseumPiece" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Museum Piece
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                  Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                >
                  {!submitLoading ? <Save className="w-4 h-4 mr-2" /> : <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={filters.regexsearch}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Items Grid */}
      {data?.stamps && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {data.stamps.length > 0 ? (
              data.stamps.map((item) => (
                <Card key={item._id}>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        <div className="flex space-x-1">
                          {item.category.length > 0 && item.category.map((cat, index) => (
                            <Badge key={index} variant="secondary">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">{formatPrice(item.price)}</span>
                        <span className="text-sm text-muted-foreground">Stock: {item.availableQuantity}</span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        {item.isForSale && <Badge size="sm">For Sale</Badge>}
                        {item.isMuseumPiece && <Badge size="sm">Museum Piece</Badge>}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item._id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No stamps found matching your criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default StampsManagement;