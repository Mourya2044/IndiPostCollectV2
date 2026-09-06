import React, { useEffect, useState } from 'react';
import { User, Edit2, Save, X, Camera, ArrowUpRight, MessageSquare, Heart, BookOpen } from 'lucide-react';
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAlbumStore } from "@/store/useAlbumStore";
import ProfilePosts from '@/components/profile/ProfilePosts';
import ProfileOrders from '@/components/profile/ProfileOrders';
import ProfileEvents from '@/components/profile/ProfileEvents';
import ProfileWishlist from '@/components/profile/ProfileWishlist';
import ProfileAlbum from '@/components/profile/ProfileAlbum';
import { Link, useSearchParams } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfilePic, isLoading, updateAddress } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const { album } = useAlbumStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    ['wishlist', 'album'].includes(searchParams.get('tab')) ? searchParams.get('tab') : 'posts'
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(user?.address || { locality: '', country: '', city: '', district: '', pin: '' });

  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'wishlist' || tab === 'album') setActiveTab(tab);
    else if (!tab && (activeTab === 'wishlist' || activeTab === 'album')) setActiveTab('posts');
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab !== 'posts' ? { tab } : {});
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setSelectedImage(reader.result);
      await updateProfilePic(reader.result);
    };
  };

  const handleAddressSave = async () => {
    if (!tempAddress.locality || !tempAddress.city || !tempAddress.district || !tempAddress.state || !tempAddress.pin) {
      alert("Please fill in all address fields.");
      return;
    }
    await updateAddress(tempAddress);
    setIsEditingAddress(false);
  };

  if (!user) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-2">Dashboard</p>
            <h1 className="text-3xl font-light text-foreground">Welcome back, {user.fullName.split(' ')[0]}</h1>
          </div>
          {user.type === "admin" && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 border border-IPCprimary text-IPCprimary text-xs font-semibold uppercase tracking-widest hover:bg-IPCprimary hover:text-white transition-all"
            >
              Admin Dashboard <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column: Profile Info & Orders/Events ── */}
          <div className="lg:col-span-1 space-y-6">

            <div className="border border-border bg-background p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <User className="h-4 w-4 text-IPCprimary" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Profile Info</h2>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 border border-border bg-muted overflow-hidden">
                    <img
                      src={selectedImage || user.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                  <label
                    className={`absolute -bottom-3 -right-3 p-2 bg-IPCprimary text-white border border-background cursor-pointer hover:bg-IPCsecondary transition-colors ${isLoading ? "animate-pulse pointer-events-none" : ""}`}
                  >
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isLoading} />
                  </label>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {isLoading ? "Uploading…" : "Update Photo"}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Name</p>
                  <p className="font-medium text-foreground px-3 py-2 border border-border bg-muted/20">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground px-3 py-2 border border-border bg-muted/20">{user.email}</p>
                </div>

                {/* Address */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shipping Address</p>
                    {!isEditingAddress && (
                      <button onClick={() => { setTempAddress(user.address || {}); setIsEditingAddress(true); }} className="text-muted-foreground hover:text-IPCprimary transition-colors">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-2 border border-IPCprimary/30 p-3 bg-IPCprimary/5">
                      <input placeholder="Locality" value={tempAddress.locality} onChange={(e) => setTempAddress({ ...tempAddress, locality: e.target.value })} className="w-full text-xs px-2 py-1.5 border border-border outline-none bg-background focus:border-IPCprimary" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="City" value={tempAddress.city} onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })} className="w-full text-xs px-2 py-1.5 border border-border outline-none bg-background focus:border-IPCprimary" />
                        <input placeholder="District" value={tempAddress.district} onChange={(e) => setTempAddress({ ...tempAddress, district: e.target.value })} className="w-full text-xs px-2 py-1.5 border border-border outline-none bg-background focus:border-IPCprimary" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="State" value={tempAddress.state} onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })} className="w-full text-xs px-2 py-1.5 border border-border outline-none bg-background focus:border-IPCprimary" />
                        <input placeholder="PIN" type="number" value={tempAddress.pin} onChange={(e) => setTempAddress({ ...tempAddress, pin: e.target.value })} className="w-full text-xs px-2 py-1.5 border border-border outline-none bg-background focus:border-IPCprimary" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleAddressSave} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-IPCprimary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90">
                          <Save className="h-3 w-3" /> Save
                        </button>
                        <button onClick={() => setIsEditingAddress(false)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-border text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted">
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 border border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
                      {user.address?.locality ? (
                        <>
                          <p>{user.address.locality}</p>
                          <p>{user.address.city}, {user.address.district}</p>
                          <p>{user.address.state} - {user.address.pin}</p>
                        </>
                      ) : (
                        <p className="italic">No address provided.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ProfileEvents />
            <ProfileOrders userId={user._id} />
          </div>

          {/* ── Right Column: Tabbed Content (Posts / Wishlist / Album) ── */}
          <div className="lg:col-span-2 min-h-0 space-y-4">
            {/* Tab Bar */}
            <div className="flex border-b border-border bg-background overflow-x-auto">
              <button
                type="button"
                onClick={() => handleTabChange('posts')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === 'posts'
                  ? 'border-IPCprimary text-IPCprimary bg-muted/20'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Community Posts
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('wishlist')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === 'wishlist'
                  ? 'border-IPCsecondary text-IPCsecondary bg-IPCsecondary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Heart className={`h-3.5 w-3.5 ${activeTab === 'wishlist' ? 'fill-IPCsecondary' : ''}`} />
                Want-List
                {wishlist.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-IPCsecondary text-white text-[10px] font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('album')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === 'album'
                  ? 'border-IPCprimary text-IPCprimary bg-IPCprimary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Virtual Album
                {album.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-IPCprimary text-white text-[10px] font-bold">
                    {album.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'posts' && <ProfilePosts />}
            {activeTab === 'wishlist' && <ProfileWishlist />}
            {activeTab === 'album' && <ProfileAlbum />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
