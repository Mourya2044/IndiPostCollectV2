import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, ShoppingCart, Tag, Loader, Plus, Minus, BookOpen } from 'lucide-react';
import { axiosInstance } from '@/lib/axios.js';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAlbumStore } from '@/store/useAlbumStore';
import StampReviewsSection from '@/components/reviews/StampReviewsSection';

export default function StampDetailPage() {
    const { stampId } = useParams();
    const { isInWishlist, toggleWishlist } = useWishlistStore();
    const { isMounted, mountStamp } = useAlbumStore();
    const [stampDetails, setStampDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const isWishlisted = isInWishlist(stampId);
    const mountedInAlbum = isMounted(stampId);
    const [addingToCart, setAddingToCart] = useState(false);
    const [mountingAlbum, setMountingAlbum] = useState(false);

    useEffect(() => {
        const fetchStampDetails = async () => {
            try {
                setLoading(true);
                if (!stampId) return;
                const response = await axiosInstance.get(`/stamps/${stampId}`);
                setStampDetails(response.data);
            } catch (error) {
                console.error("Error fetching stamp details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStampDetails();
    }, [stampId]);

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

    const addToCart = async () => {
        setAddingToCart(true);
        try {
            await axiosInstance.post('/cart/add', { stampId, quantity });
            toast.success("Added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add to cart. Please try again.");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
                <Loader className="animate-spin text-IPCprimary" size={32} />
                <span className="text-sm text-muted-foreground tracking-widest uppercase">Loading stamp…</span>
            </div>
        );
    }

    if (!stampDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
                <p className="text-muted-foreground">Stamp not found.</p>
                <Link to="/marketplace" className="text-xs uppercase tracking-widest text-IPCprimary hover:underline">
                    ← Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            {/* ── Page breadcrumb bar ── */}
            <div className="border-b border-border bg-background sticky top-16 z-20">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link
                        to="/marketplace"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-IPCprimary transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Marketplace
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleWishlist(stampDetails)}
                            className={`p-2 border transition-all ${isWishlisted ? 'border-IPCsecondary text-IPCsecondary bg-IPCsecondary/5' : 'border-border text-muted-foreground hover:border-IPCsecondary hover:text-IPCsecondary'}`}
                            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={16} className={`transition-transform active:scale-125 ${isWishlisted ? 'fill-IPCsecondary' : ''}`} />
                        </button>
                        <button className="p-2 border border-border text-muted-foreground hover:border-IPCprimary hover:text-IPCprimary transition-all">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12">

                    {/* Left: Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-square border border-border overflow-hidden bg-muted">
                            {!imageError && stampDetails.imageUrl ? (
                                <img
                                    src={stampDetails.imageUrl}
                                    alt={stampDetails.title}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <Tag className="h-12 w-12 opacity-30" />
                                    <p className="text-sm">No image available</p>
                                </div>
                            )}

                            {/* Status badge */}
                            {stampDetails.isForSale ? (
                                <div className="absolute top-4 left-4">
                                    <span className="inline-block px-3 py-1 bg-IPCprimary text-white text-[10px] font-bold tracking-widest uppercase">
                                        For Sale
                                    </span>
                                </div>
                            ) : (
                                <div className="absolute top-4 left-4">
                                    <span className="inline-block px-3 py-1 bg-muted border border-border text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                                        Not for Sale
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Quick facts strip */}
                        <div className="grid grid-cols-4 divide-x divide-border border border-border">
                            {[
                                { label: 'Year', value: stampDetails.year },
                                { label: 'Country', value: stampDetails.country },
                                { label: 'Condition', value: stampDetails.condition },
                                { label: 'ID', value: `#${stampDetails._id?.slice(-6).toUpperCase()}` },
                            ].map(({ label, value }) => (
                                <div key={label} className="px-3 py-3 text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                                    <p className="text-xs font-semibold text-foreground truncate">{value || '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details + Purchase */}
                    <div className="space-y-6">

                        {/* Category tags */}
                        {stampDetails.category?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {stampDetails.category.map((cat, i) => (
                                    <span key={i} className="px-3 py-1 border border-IPCprimary/40 text-IPCprimary text-[10px] tracking-widest uppercase font-semibold">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-light text-foreground leading-tight">{stampDetails.title}</h1>
                        </div>

                        {/* Price */}
                        {stampDetails.isForSale && (
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-IPCprimary">{formatPrice(stampDetails.price)}</span>
                                {stampDetails.originalPrice && stampDetails.originalPrice > stampDetails.price && (
                                    <>
                                        <span className="text-lg text-muted-foreground line-through">{formatPrice(stampDetails.originalPrice)}</span>
                                        <span className="px-2 py-0.5 bg-IPCsecondary text-white text-xs font-bold">
                                            -{Math.round(((stampDetails.originalPrice - stampDetails.price) / stampDetails.originalPrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCprimary">Description</p>
                            <div className="border-l-2 border-IPCsecondary pl-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">{stampDetails.description}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-border" />

                        {/* Purchase block */}
                        {stampDetails.isForSale ? (
                            <div className="space-y-4">
                                {/* Quantity */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Quantity</p>
                                    <div className="inline-flex items-center border border-border">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-IPCprimary hover:bg-IPCprimary/5 transition-colors border-r border-border"
                                        >
                                            <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-IPCprimary hover:bg-IPCprimary/5 transition-colors border-l border-border"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Add to cart */}
                                <button
                                    onClick={addToCart}
                                    disabled={addingToCart}
                                    className="w-full inline-flex items-center justify-center gap-3 py-4 bg-IPCprimary text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingToCart ? (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ShoppingCart className="h-4 w-4" />
                                    )}
                                    {addingToCart ? 'Adding…' : 'Add to Cart'}
                                </button>

                                {/* Total */}
                                <div className="flex items-center justify-between text-sm border border-border px-4 py-3 bg-IPCprimary/5">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Total</span>
                                    <span className="font-bold text-IPCprimary">{formatPrice(stampDetails.price * quantity)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-border px-5 py-5 text-center space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Not Available for Purchase</p>
                                <p className="text-sm text-muted-foreground">This stamp is part of a private collection.</p>
                            </div>
                        )}

                        {/* Mount into Virtual Album */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={async () => {
                                    if (mountedInAlbum) {
                                        toast.info("This stamp is already mounted in your virtual album!");
                                        return;
                                    }
                                    setMountingAlbum(true);
                                    try {
                                        await mountStamp(stampId, "Mounted from stamp catalog");
                                    } catch (err) {
                                        // toast handled in store
                                    } finally {
                                        setMountingAlbum(false);
                                    }
                                }}
                                disabled={mountingAlbum || mountedInAlbum}
                                className={`w-full inline-flex items-center justify-center gap-2 py-3 border text-xs font-semibold uppercase tracking-widest transition-all ${
                                    mountedInAlbum
                                        ? 'border-border text-muted-foreground bg-muted/40 cursor-default'
                                        : 'border-border hover:border-IPCprimary hover:text-IPCprimary hover:bg-IPCprimary/5'
                                }`}
                            >
                                {mountingAlbum ? (
                                    <Loader className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <BookOpen className="h-3.5 w-3.5" />
                                )}
                                {mountedInAlbum ? 'Mounted in Virtual Album' : 'Mount to Virtual Album'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collector Reviews & Condition Grading */}
                <StampReviewsSection stampId={stampId} />
            </main>
        </div>
    );
}