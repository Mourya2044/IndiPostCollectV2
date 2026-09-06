import React, { useState, useEffect } from 'react';
import { BookOpen, Tag, Calendar, MapPin, Edit3, Trash2, Check, X, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAlbumStore } from '@/store/useAlbumStore';

const ERAS = [
  { id: 'all', label: 'All Eras' },
  { id: 'classic', label: 'Pre-1947 (Classic)', min: 0, max: 1946 },
  { id: 'early', label: '1947–1975 (Early Republic)', min: 1947, max: 1975 },
  { id: 'modern', label: '1976–2000 (Modern)', min: 1976, max: 2000 },
  { id: 'contemporary', label: '2001+ (21st Century)', min: 2001, max: 9999 },
];

const ProfileAlbum = () => {
  const { album, stats, isLoading, fetchAlbum, updateNotes, unmountStamp } = useAlbumStore();
  const [selectedEra, setSelectedEra] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStampId, setEditingStampId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const formatPrice = (price) => {
    if (price == null) return '₹0';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const handleStartEdit = (item) => {
    const stampId = (item.stamp._id || item.stamp).toString();
    setEditingStampId(stampId);
    setTempNotes(item.notes || '');
  };

  const handleSaveNotes = async (stampId) => {
    await updateNotes(stampId, tempNotes);
    setEditingStampId(null);
  };

  // Filter items based on era and search
  const filteredItems = album.filter((item) => {
    const s = item.stamp;
    if (!s) return false;

    // Era match
    if (selectedEra !== 'all') {
      const eraConfig = ERAS.find(e => e.id === selectedEra);
      if (eraConfig && s.year) {
        if (s.year < eraConfig.min || s.year > eraConfig.max) return false;
      }
    }

    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title?.toLowerCase().includes(q);
      const matchCountry = s.country?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      const matchYear = s.year?.toString().includes(q);
      if (!matchTitle && !matchCountry && !matchNotes && !matchYear) return false;
    }

    return true;
  });

  if (isLoading && album.length === 0) {
    return (
      <div className="border border-border bg-background p-12 flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-IPCprimary border-t-transparent"></div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Opening Virtual Binder…</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-background space-y-6">

      {/* Header & Stats Banner */}
      <div className="p-6 border-b border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-IPCprimary bg-IPCprimary/5 flex items-center justify-center text-IPCprimary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold uppercase tracking-widest text-foreground">
                  Virtual Stamp Album
                </h2>
                <span className="px-2 py-0.5 bg-IPCprimary/10 border border-IPCprimary/30 text-IPCprimary text-[10px] font-bold uppercase tracking-wider">
                  Digital Binder
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your authenticated digital mounts and personal collection catalog.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Collection Value</span>
            <span className="text-lg font-bold text-IPCprimary">
              {formatPrice(stats.totalEstimatedValue || 0)}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border">
          <div className="bg-background p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Mounted</span>
            <span className="text-base font-bold text-foreground">{stats.totalStamps} stamps</span>
          </div>
          <div className="bg-background p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Themes</span>
            <span className="text-base font-bold text-foreground">{stats.uniqueThemes} categories</span>
          </div>
          <div className="bg-background p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Earliest Stamp</span>
            <span className="text-base font-bold text-foreground">{stats.earliestYear}</span>
          </div>
          <div className="bg-background p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Latest Stamp</span>
            <span className="text-base font-bold text-foreground">{stats.latestYear}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="px-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Eras Tabs */}
          <div className="flex flex-wrap gap-1 border border-border p-1 bg-muted/20">
            {ERAS.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era.id)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  selectedEra === era.id
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {era.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <input
              type="search"
              placeholder="Search album…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-background border border-border focus:outline-none focus:border-IPCprimary"
            />
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute right-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Album Grid / Binder Presentation */}
      <div className="px-6 pb-6">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center border border-border border-dashed space-y-4">
            <div className="w-12 h-12 border border-border mx-auto flex items-center justify-center text-muted-foreground/40">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {album.length === 0 ? "Your Virtual Album is empty" : "No stamps match this filter"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {album.length === 0
                  ? "Stamps purchased through IndiPostCollect will automatically be mounted here, or you can mount stamps from the catalog."
                  : "Try switching eras or clearing your search term to see other stamps."}
              </p>
            </div>
            {album.length === 0 && (
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-IPCprimary text-IPCprimary text-xs font-semibold uppercase tracking-widest hover:bg-IPCprimary hover:text-white transition-all"
              >
                Explore Stamps <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const stamp = item.stamp;
              const stampId = (stamp._id || stamp).toString();
              const isEditing = editingStampId === stampId;

              return (
                <div
                  key={item._id || stampId}
                  className="group relative bg-background border border-border flex flex-col transition-all hover:border-IPCprimary/50 hover:shadow-md"
                >
                  {/* Physical Stamp Mount Visual Framing */}
                  <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-center relative">
                    {/* Simulated Protective Philatelic Hawid Mount */}
                    <div className="relative p-2 bg-neutral-900 shadow-inner border border-neutral-700">
                      <div className="w-36 h-36 overflow-hidden bg-neutral-950 flex items-center justify-center">
                        {stamp.imageUrl ? (
                          <img
                            src={stamp.imageUrl}
                            alt={stamp.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Tag className="h-8 w-8 text-neutral-600" />
                        )}
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-2 bg-white/10 pointer-events-none" />
                    </div>

                    {/* Condition badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-1.5 py-0.5 bg-background/90 backdrop-blur-xs border border-border text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {stamp.condition || 'Mint'}
                      </span>
                    </div>

                    {/* Source badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-1.5 py-0.5 bg-IPCprimary/10 border border-IPCprimary/20 text-[9px] font-bold uppercase tracking-wider text-IPCprimary">
                        {item.source || 'Mount'}
                      </span>
                    </div>
                  </div>

                  {/* Stamp Details */}
                  <div className="p-4 flex flex-col flex-1 gap-2.5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Calendar className="h-3 w-3 text-IPCprimary" /> {stamp.year || 'Unknown Year'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {stamp.country}
                      </span>
                    </div>

                    <Link
                      to={`/${stamp.isMuseumPiece ? 'museum' : 'marketplace'}/${stampId}`}
                      className="text-sm font-semibold text-foreground hover:text-IPCprimary transition-colors line-clamp-1"
                    >
                      {stamp.title}
                    </Link>

                    {/* Personal Notes / Provenance */}
                    <div className="pt-2 border-t border-border mt-auto space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Collector Notes
                        </span>
                        {!isEditing && (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="text-muted-foreground hover:text-IPCprimary transition-colors"
                            title="Edit notes"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Add provenance, acquisition details, condition notes…"
                            className="w-full p-2 text-xs border border-IPCprimary bg-background focus:outline-none resize-none h-16"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleSaveNotes(stampId)}
                              className="px-2.5 py-1 bg-IPCprimary text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:opacity-90"
                            >
                              <Check className="h-3 w-3" /> Save
                            </button>
                            <button
                              onClick={() => setEditingStampId(null)}
                              className="px-2.5 py-1 border border-border text-foreground text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-muted"
                            >
                              <X className="h-3 w-3" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic line-clamp-2 min-h-4">
                          {item.notes || 'No provenance notes added yet.'}
                        </p>
                      )}
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <span className="font-bold text-IPCprimary">{formatPrice(stamp.price)}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/${stamp.isMuseumPiece ? 'museum' : 'marketplace'}/${stampId}`}
                          className="p-1.5 border border-border text-muted-foreground hover:text-IPCprimary hover:border-IPCprimary transition-all"
                          title="View Stamp"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(`Unmount "${stamp.title}" from your virtual album?`)) {
                              unmountStamp(stampId);
                            }
                          }}
                          className="p-1.5 border border-border text-muted-foreground hover:text-IPCsecondary hover:border-IPCsecondary hover:bg-IPCsecondary/5 transition-all"
                          title="Unmount from album"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAlbum;
