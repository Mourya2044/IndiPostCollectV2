import React, { useEffect, useState } from 'react';
import {
    ArrowLeft, Heart, Share2, Calendar, MapPin, Award,
    Eye, Users, Library, Loader, Tag, BookOpen
} from 'lucide-react';
import { axiosInstance } from '@/lib/axios.js';
import { useParams, Link } from 'react-router-dom';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAlbumStore } from '@/store/useAlbumStore';
import { toast } from 'sonner';
import StampReviewsSection from '@/components/reviews/StampReviewsSection';

export default function MuseumStampPage() {
    const { stampId } = useParams();
    const { isInWishlist, toggleWishlist } = useWishlistStore();
    const { isMounted, mountStamp } = useAlbumStore();
    const [stamp, setStamp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const isWishlisted = isInWishlist(stampId);
    const mountedInAlbum = isMounted(stampId);
    const [mountingAlbum, setMountingAlbum] = useState(false);

    useEffect(() => {
        const fetchStampDetails = async () => {
            try {
                setLoading(true);
                if (!stampId) return;
                const response = await axiosInstance.get(`/stamps/${stampId}`);
                setStamp(response.data);
            } catch (error) {
                console.error("Error fetching stamp details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStampDetails();
    }, [stampId]);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
                <Loader className="animate-spin text-IPCprimary" size={32} />
                <span className="text-sm text-muted-foreground tracking-widest uppercase">Loading artifact…</span>
            </div>
        );
    }

    if (!stamp) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
                <p className="text-muted-foreground">Stamp not found.</p>
                <Link to="/museum" className="text-xs uppercase tracking-widest text-IPCprimary hover:underline">
                    ← Back to Museum
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            {/* ── Page Header bar ── */}
            <div className="border-b border-border bg-background sticky top-16 z-20">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link
                        to="/museum"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-IPCprimary transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Museum
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleWishlist(stamp)}
                            className={`p-2 border transition-all ${isWishlisted ? 'border-IPCsecondary text-IPCsecondary bg-IPCsecondary/5' : 'border-border text-muted-foreground hover:border-IPCsecondary hover:text-IPCsecondary'}`}
                            aria-label="Wishlist"
                        >
                            <Heart size={16} className={`transition-transform active:scale-125 ${isWishlisted ? 'fill-IPCsecondary' : ''}`} />
                        </button>
                        <button className="p-2 border border-border text-muted-foreground hover:border-IPCprimary hover:text-IPCprimary transition-all">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <div className="bg-IPCprimary text-white">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Library className="w-5 h-5 text-IPCtext" />
                        <span className="text-xs uppercase tracking-[0.3em] text-IPCtext font-medium">Museum Collection</span>
                        <span className="px-2.5 py-0.5 bg-IPCsecondary text-white text-[10px] font-bold tracking-widest uppercase">
                            Preserved Artifact
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light mb-3 leading-tight">{stamp.title}</h1>
                    <p className="text-white/50 text-sm font-light">
                        A treasured piece of philatelic history from {stamp.country}
                    </p>
                </div>
                <div className="h-0.5 bg-IPCsecondary" />
            </div>

            {/* ── Main Content ── */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left: Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-square border border-border overflow-hidden bg-muted">
                            {!imageError && stamp.imageUrl ? (
                                <img
                                    src={stamp.imageUrl}
                                    alt={stamp.title}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <Tag className="h-12 w-12 opacity-30" />
                                    <p className="text-sm">No image available</p>
                                </div>
                            )}
                            {/* Museum stamp overlay */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-IPCprimary text-white text-[10px] font-bold tracking-widest uppercase">
                                    <Library className="h-3 w-3" /> Museum Piece
                                </span>
                            </div>
                        </div>

                        {/* Quick facts strip */}
                        <div className="grid grid-cols-3 divide-x divide-border border border-border">
                            {[
                                { label: 'Year', value: stamp.year },
                                { label: 'Country', value: stamp.country },
                                { label: 'Condition', value: stamp.condition },
                            ].map(({ label, value }) => (
                                <div key={label} className="px-4 py-3 text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                                    <p className="text-sm font-semibold text-foreground">{value || '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">

                        {/* Category tags */}
                        {stamp.category?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {stamp.category.map((cat, i) => (
                                    <span key={i} className="px-3 py-1 border border-IPCprimary/40 text-IPCprimary text-[10px] tracking-widest uppercase font-semibold">
                                        {cat}
                                    </span>
                                ))}
                                <span className="px-3 py-1 bg-IPCaccent text-white text-[10px] tracking-widest uppercase font-semibold">
                                    Museum Collection
                                </span>
                            </div>
                        )}

                        {/* Section: Historical Significance */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCprimary">Historical Significance</p>
                            <div className="border-l-2 border-IPCsecondary pl-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">{stamp.description}</p>
                            </div>
                        </div>

                        {/* Section: Museum Status */}
                        <div className="border border-border">
                            <div className="px-4 py-3 bg-IPCprimary/5 border-b border-border">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCprimary flex items-center gap-2">
                                    <Library className="h-3.5 w-3.5" /> Museum Status
                                </p>
                            </div>
                            <div className="divide-y divide-border">
                                {[
                                    { label: 'Acquisition', value: 'Permanently Housed' },
                                    { label: 'Public Access', value: 'Available' },
                                    { label: 'Conservation', value: stamp.condition || 'Preserved' },
                                    { label: 'Catalog ID', value: `#${stamp._id?.slice(-8).toUpperCase()}` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                        <span className="text-muted-foreground text-xs">{label}</span>
                                        <span className="font-semibold text-foreground text-xs">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mount into Virtual Album */}
                        <div>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (mountedInAlbum) {
                                        toast.info("This museum artifact is already mounted in your virtual album!");
                                        return;
                                    }
                                    setMountingAlbum(true);
                                    try {
                                        await mountStamp(stampId, "Mounted from National Museum Collection");
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
                                        : 'border-IPCprimary text-IPCprimary hover:bg-IPCprimary hover:text-white'
                                }`}
                            >
                                {mountingAlbum ? (
                                    <Loader className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <BookOpen className="h-3.5 w-3.5" />
                                )}
                                {mountedInAlbum ? 'Mounted in Virtual Album' : 'Mount into Virtual Album'}
                            </button>
                        </div>

                        {/* Section: Museum info badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { icon: Eye, label: 'Public Viewing' },
                                { icon: Award, label: 'Authenticated' },
                                { icon: Users, label: 'Educational' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2.5 px-3 py-3 border border-border text-xs text-muted-foreground hover:border-IPCprimary hover:text-IPCprimary transition-colors">
                                    <Icon className="h-4 w-4 shrink-0 text-IPCaccent" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Timeline section ── */}
                <div className="mt-16 border-t border-border pt-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCprimary mb-6 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" /> Collection Timeline
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
                        {[
                            { dot: 'bg-IPCprimary', label: 'Added to Collection', value: formatDate(stamp.createdAt) },
                            { dot: 'bg-IPCaccent', label: 'Last Updated', value: formatDate(stamp.updatedAt) },
                            { dot: 'bg-IPCsecondary', label: 'Original Era', value: stamp.year },
                        ].map(({ dot, label, value }) => (
                            <div key={label} className="bg-background px-6 py-5 flex items-start gap-4">
                                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${dot}`} />
                                <div>
                                    <p className="text-xs font-semibold text-foreground">{label}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Collector Reviews & Condition Grading ── */}
                <StampReviewsSection stampId={stampId} />
            </main>
        </div>
    );
}