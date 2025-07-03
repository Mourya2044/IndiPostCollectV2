import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Loader, Share2, ShoppingCart, Tag } from 'lucide-react';
import { axiosInstance } from '@/lib/axios.js';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'


export default function StampDetailPage() {
  const { stampId } = useParams();
  const [stampDetails, setStampDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => {
    setImageError(true);
  };

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchStampDetails = async () => {
      try {
        setLoading(true);
        if (!stampId) {
          return;
        }
        const response = await axiosInstance.get(`/stamps/${stampId}`);
        setStampDetails(response.data);
        // console.log("Stamp Details:", response.data);

      } catch (error) {
        console.error("Error fetching stamp details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStampDetails();
  }, [stampId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const addToCart = async () => {
    try {
      const response = await axiosInstance.post('/cart/add', {
        stampId,
        quantity
      });
      console.log("Added to cart:", response.data);
      toast.success("Stamp added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={40} />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }


  return (
    stampDetails && <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Marketplace</span>
            </button> */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-full transition-colors ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
              {!imageError && stampDetails?.imageUrl ? (
                <img
                  src={stampDetails?.imageUrl}
                  alt={stampDetails?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center text-gray-500">
                    <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No Image</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">

            {/* Title and Categories */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {stampDetails.category.map((cat, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {cat}
                  </span>
                ))}
                {!stampDetails.isForSale && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                    Not For Sale
                  </span>
                )}
                {stampDetails.isMuseumPiece && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    Museum Piece
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{stampDetails.title}</h1>
              {stampDetails.isForSale && (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(stampDetails.price)}</span>
                </div>
              )}
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm text-gray-600">Year</span>
                <p className="font-semibold">{stampDetails.year}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Country</span>
                <p className="font-semibold">{stampDetails.country}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <p className="font-semibold">{stampDetails.category.join(', ')}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">ID</span>
                <p className="font-semibold text-xs">{stampDetails._id.slice(-8)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{stampDetails.description}</p>
            </div>

            {/* Purchase Options - Only show if for sale */}
            {stampDetails.isForSale && (
              <div className="space-y-4 p-6 bg-white border border-gray-200 rounded-lg">
                <Button 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  onClick={addToCart}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Not for sale message */}
            {!stampDetails.isForSale && (
              <div className="p-6 bg-gray-100 border border-gray-200 rounded-lg text-center">
                <p className="text-gray-600 mb-4">This stampDetails is not currently for sale</p>
                {/* <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Contact Owner
                </button> */}
              </div>
            )}
          </div>
        </div>

        {/* Owner Information */}
        {/* <div className="mt-12 bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Owner Information</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {stampDetails.owner.slice(-4).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">Owner ID: {stampDetails.owner}</p>
              <p className="text-sm text-gray-600">Verified Member</p>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}