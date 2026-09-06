import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowUpRight, Tag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '@/store/useWishlistStore';

const ProfileWishlist = () => {
  const { wishlist, isLoading, removeFromWishlist, moveToCart } = useWishlistStore();

  const formatPrice = (price) => {
    if (price == null) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="border border-border bg-background p-12 flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-IPCprimary border-t-transparent"></div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Loading Saved Stamps…</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-IPCsecondary fill-IPCsecondary" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Saved Stamps & Want-List
          </h2>
        </div>
        <span className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{wishlist.length}</span> {wishlist.length === 1 ? 'stamp' : 'stamps'}
        </span>
      </div>

      {/* Content */}
      {wishlist.length === 0 ? (
        <div className="p-16 text-center space-y-4">
          <div className="w-12 h-12 border border-border mx-auto flex items-center justify-center text-muted-foreground/40">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Your want-list is empty</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Save rare stamps while browsing the marketplace or museum to track them here.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-IPCprimary text-IPCprimary text-xs font-semibold uppercase tracking-widest hover:bg-IPCprimary hover:text-white transition-all"
          >
            Browse Marketplace <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {wishlist.map((stamp) => {
            const isPurchaseable = stamp.isForSale && (stamp.availableQuantity == null || stamp.availableQuantity > 0);

            return (
              <div
                key={stamp._id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-muted/10 transition-colors group"
              >
                {/* Stamp Info Left */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 shrink-0 border border-border bg-muted overflow-hidden relative">
                    {stamp.imageUrl ? (
                      <img
                        src={stamp.imageUrl}
                        alt={stamp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Tag className="h-5 w-5 opacity-30" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-border text-muted-foreground">
                        {stamp.condition || 'Mint'}
                      </span>
                      {stamp.year && (
                        <span className="text-xs text-muted-foreground">
                          {stamp.year} • {stamp.country}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/${stamp.isMuseumPiece ? 'museum' : 'marketplace'}/${stamp._id}`}
                      className="text-sm font-semibold text-foreground hover:text-IPCprimary transition-colors block truncate"
                    >
                      {stamp.title}
                    </Link>
                    <div className="text-xs">
                      {stamp.isForSale ? (
                        <span className="font-bold text-IPCprimary">{formatPrice(stamp.price)}</span>
                      ) : (
                        <span className="text-muted-foreground uppercase text-[10px] tracking-wider">
                          {stamp.isMuseumPiece ? 'Museum Piece' : 'Not for sale'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    to={`/${stamp.isMuseumPiece ? 'museum' : 'marketplace'}/${stamp._id}`}
                    className="p-2 border border-border text-muted-foreground hover:text-IPCprimary hover:border-IPCprimary transition-all"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  {isPurchaseable && (
                    <button
                      type="button"
                      onClick={() => moveToCart(stamp)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-IPCprimary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                      title="Move to Cart"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Move to Cart
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(stamp._id)}
                    className="p-2 border border-border text-muted-foreground hover:text-IPCsecondary hover:border-IPCsecondary hover:bg-IPCsecondary/5 transition-all"
                    title="Remove from want-list"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileWishlist;
