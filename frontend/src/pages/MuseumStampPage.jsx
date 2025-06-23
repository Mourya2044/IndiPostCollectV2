import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Share2, Calendar, MapPin, Award, Info, Eye, Users, Clock, Library, Loader, Tag } from 'lucide-react';
import { axiosInstance } from '@/lib/axios.js';
import { useParams } from 'react-router-dom';

export default function MuseumStampPage() {
  const { stampId } = useParams();
  const [stamp, setStamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => {
        setImageError(true);
    };

  useEffect(() => {
      const fetchStampDetails = async () => {
        try {
          setLoading(true);
          if (!stampId) {
            return;
          }
          const response = await axiosInstance.get(`/stamps/${stampId}`);
          setStamp(response.data);
          // console.log("Stamp Details:", response.data);
          
        } catch (error) {
          console.error("Error fetching stamp details:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchStampDetails();
    }, [stampId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={40} />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Museum</span>
            </button>
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
      </header> */}

      {/* Museum Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Library className="w-8 h-8 text-yellow-400" />
            <span className="text-lg font-medium">Museum Collection</span>
            <span className="px-3 py-1 bg-yellow-400 text-purple-900 text-sm font-semibold rounded-full">
              PRESERVED ARTIFACT
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{stamp.title}</h1>
          <p className="text-xl text-purple-200">
            A treasured piece of philatelic history from {stamp.country}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image and Museum Status */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white rounded-lg border-2 border-purple-200 overflow-hidden shadow-lg">
              {!imageError && stamp?.imageUrl ? (
                    <img
                        src={stamp?.imageUrl}
                        alt={stamp?.title}
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
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Museum Piece
              </div>
            </div>
            
            
          </div>

          {/* Stamp Details */}
          <div className="space-y-6">
            
            {/* Title and Categories */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {stamp.category.map((cat, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    {cat}
                  </span>
                ))}
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  Museum Collection
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Artifact Details</h2>
            </div>

            {/* Historical Information */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <span className="text-sm text-gray-600">Year</span>
                <p className="font-semibold">{stamp.year}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Country</span>
                <p className="font-semibold">{stamp.country}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <p className="font-semibold">{stamp.category.join(', ')}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Catalog ID</span>
                <p className="font-semibold text-xs">{stamp._id.slice(-8)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Historical Significance</h3>
              <p className="text-gray-700 leading-relaxed">{stamp.description}</p>
            </div>

            {/* Museum Status */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Library className="w-5 h-5" />
                Museum Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Acquisition Status</span>
                  <span className="font-semibold">Permanently Housed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Public Access</span>
                  <span className="font-semibold">Available</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Conservation Status</span>
                  <span className="font-semibold">{stamp.condition}</span>
                </div>
              </div>
            </div>

            {/* Museum Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Museum Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-purple-600">
                  <Eye className="w-4 h-4" />
                  <span>Available for public viewing</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Award className="w-4 h-4" />
                  <span>Authenticated and preserved</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Users className="w-4 h-4" />
                  <span>Educational resource</span>
                </div>
              </div>
            </div>

            {/* Visitor Actions */}
            {/* <div className="space-y-3">
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                Plan Museum Visit
              </button>
              <button className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Request Educational Materials
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Contact Curator
              </button>
            </div> */}
          </div>
        </div>

        {/* Collection Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Collection Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Collection Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Added to Collection</p>
                  <p className="text-sm text-gray-600">{formatDate(stamp.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-gray-600">{formatDate(stamp.updatedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Original Era</p>
                  <p className="text-sm text-gray-600">{stamp.year}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custodian Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Custodian Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Library className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Museum Collection</p>
                  <p className="text-sm text-gray-600">Custodian ID: {stamp.owner}</p>
                  <p className="text-sm text-gray-600">Verified Institution</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status</span>
                    <p className="font-medium text-green-600">Active Display</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Access</span>
                    <p className="font-medium">Public Viewing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}