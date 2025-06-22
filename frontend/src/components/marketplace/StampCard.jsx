import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Heart,
    ShoppingCart,
    Eye,
    Tag,
    Calendar,
    MapPin,
    Library
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StampCard({ stamp }) {
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const formatPrice = (price) => {
        if (price == null) return null;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    // const formatDate = (dateString) => {
    //     if (!dateString) return null;
    //     return new Date(dateString).toLocaleDateString();
    // };

    return (
        <Card className="group hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
            {/* Badge for special items */}
            {stamp.isMuseumPiece && (
                <Badge className="absolute top-2 right-2 z-10 bg-purple-100 text-purple-800">
                    <Library className="h-3 w-3 mr-1" />
                    Museum
                </Badge>
            )}

            {/* Image Section */}
            <div className="relative overflow-hidden bg-gray-100 aspect-square">
                {!imageError && stamp.imageUrl ? (
                    <img
                        src={stamp.imageUrl}
                        alt={stamp.title}
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

                {/* Overlay with quick actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Heart
                                className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                            />
                        </Button>
                        {/* <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 rounded-full"
                        >
                            <Eye className="h-4 w-4" />
                        </Button> */}
                    </div>
                </div>
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {stamp.title}
                </CardTitle>

                {/* Categories */}
                {stamp.categories && stamp.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {stamp.categories.map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {category}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardHeader>

            <CardContent className="pt-0">
                {/* Description */}
                {stamp.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {stamp.description}
                    </p>
                )}

                {/* Metadata */}
                <div className="space-y-1 text-xs text-gray-500">
                    {stamp.year && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{stamp.year}</span>
                        </div>
                    )}

                    {stamp.country && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{stamp.country}</span>
                        </div>
                    )}

                    {stamp.condition && (
                        <div className="flex items-center gap-1">
                            <span className="font-medium">Condition:</span>
                            <span>{stamp.condition}</span>
                        </div>
                    )}
                </div>

                {/* Price */}
                {stamp.price && (
                    <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">
                                {formatPrice(stamp.price)}
                            </span>
                            {stamp.originalPrice && stamp.originalPrice > stamp.price && (
                                <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(stamp.originalPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0">
                <div className="w-full flex gap-2">
                    {stamp.forSale && (
                        <Button className="flex-1" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {stamp.price ? 'Buy Now' : 'Contact Seller'}
                        </Button>
                    )}
                    
                    <Link to={`/marketplace/${stamp._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className={stamp.forSale ? 'flex-1' : 'w-full'}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </Button>
                    </Link>
                </div>
            </CardFooter>

            {/* Sale indicator */}
            {stamp.forSale && (
                <div className="absolute top-2 left-2">
                    <Badge className="bg-green-100 text-green-800">
                        For Sale
                    </Badge>
                </div>
            )}

            {/* Discount badge */}
            {stamp.originalPrice && stamp.price && stamp.originalPrice > stamp.price && (
                <div className="absolute top-2 left-2 mt-6">
                    <Badge className="bg-red-100 text-red-800">
                        {Math.round(((stamp.originalPrice - stamp.price) / stamp.originalPrice) * 100)}% OFF
                    </Badge>
                </div>
            )}
        </Card>
    );
}