import { useState } from "react";
import { Heart, ShoppingCart, Eye, Tag, Calendar, MapPin, Library } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function StampCard({ stamp }) {
    const { isInWishlist, toggleWishlist } = useWishlistStore();
    const isLiked = isInWishlist(stamp._id);
    const [imageError, setImageError] = useState(false);

    const formatPrice = (price) => {
        if (price == null) return null;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const discountPct = stamp.originalPrice && stamp.price && stamp.originalPrice > stamp.price
        ? Math.round(((stamp.originalPrice - stamp.price) / stamp.originalPrice) * 100)
        : null;

    return (
        <div className="group relative bg-background border border-border flex flex-col overflow-hidden transition-all duration-300 hover:border-IPCprimary/40 hover:shadow-lg hover:-translate-y-0.5">

            {/* ── Image ── */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {!imageError && stamp.imageUrl ? (
                    <img
                        src={stamp.imageUrl}
                        alt={stamp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageError(true)}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                        <Tag className="h-10 w-10 opacity-30" />
                        <span className="text-xs">No image</span>
                    </div>
                )}

                {/* Top-left badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {stamp.forSale && (
                        <span className="inline-block px-2 py-0.5 bg-IPCprimary text-white text-[10px] tracking-widest uppercase font-semibold">
                            For Sale
                        </span>
                    )}
                    {discountPct && (
                        <span className="inline-block px-2 py-0.5 bg-IPCsecondary text-white text-[10px] tracking-widest uppercase font-semibold">
                            -{discountPct}%
                        </span>
                    )}
                </div>

                {/* Top-right museum badge */}
                {stamp.isMuseumPiece && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 bg-IPCaccent text-white text-[10px] tracking-widest uppercase font-semibold">
                        <Library className="h-3 w-3" /> Museum
                    </span>
                )}

                {/* Hover overlay: wishlist */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-end justify-end p-3 pointer-events-none">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(stamp);
                        }}
                        className={`pointer-events-auto transition-all duration-200 p-2 bg-background/90 backdrop-blur-sm border ${
                            isLiked ? 'opacity-100 border-IPCsecondary text-IPCsecondary shadow-sm' : 'opacity-0 group-hover:opacity-100 border-border hover:border-IPCsecondary'
                        }`}
                        aria-label="Wishlist"
                    >
                        <Heart className={`h-4 w-4 transition-transform active:scale-125 ${isLiked ? 'fill-IPCsecondary text-IPCsecondary' : 'text-foreground'}`} />
                    </button>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex flex-col flex-1 p-4 gap-3">

                {/* Categories */}
                {stamp.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {stamp.categories.slice(0, 3).map((cat, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 border border-border text-muted-foreground tracking-wide uppercase">
                                {cat}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-IPCprimary transition-colors line-clamp-2">
                    {stamp.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    {stamp.year && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {stamp.year}
                        </span>
                    )}
                    {stamp.country && (
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {stamp.country}
                        </span>
                    )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Price + CTA row */}
                <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
                    <div>
                        {stamp.isForSale ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-base font-bold text-IPCprimary">{formatPrice(stamp.price)}</span>
                                {stamp.originalPrice && stamp.originalPrice > stamp.price && (
                                    <span className="text-xs text-muted-foreground line-through">{formatPrice(stamp.originalPrice)}</span>
                                )}
                            </div>
                        ) : (
                            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                                {stamp.isMuseumPiece ? 'Museum Piece' : 'Not for Sale'}
                            </span>
                        )}
                    </div>

                    <Link
                        to={`/${stamp.isMuseumPiece ? 'museum' : 'marketplace'}/${stamp._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-IPCprimary text-IPCprimary hover:bg-IPCprimary hover:text-white transition-all duration-200"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        View
                    </Link>
                </div>
            </div>

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-IPCsecondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
    );
}