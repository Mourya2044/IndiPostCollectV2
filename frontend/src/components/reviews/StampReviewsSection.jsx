import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MessageSquare, Plus, Trash2, CheckCircle2, User as UserIcon, Loader } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const CONDITION_OPTIONS = [
  "Mint Never Hinged (MNH)",
  "Mint Lightly Hinged (MLH)",
  "Used (Superb/Fine)",
  "Used (Good)",
  "First Day Cover (FDC)"
];

const StampReviewsSection = ({ stampId }) => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [conditionAssessment, setConditionAssessment] = useState(CONDITION_OPTIONS[0]);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    if (!stampId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/reviews/stamp/${stampId}`);
      setReviews(res.data.reviews || []);
      setStats(res.data.stats || { totalReviews: 0, avgRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [stampId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    if (!headline.trim() || !comment.trim()) {
      toast.error('Please fill in both headline and review details');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post(`/reviews/stamp/${stampId}`, {
        rating,
        conditionAssessment,
        headline,
        comment
      });
      toast.success('Your review and condition report has been published!');
      setShowForm(false);
      setHeadline('');
      setComment('');
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (count, size = 14) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= count ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="border-t border-border mt-16 pt-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-1">
            Authentication & Collector Feedback
          </p>
          <h2 className="text-2xl font-light text-foreground">Collector Reviews & Reports</h2>
        </div>

        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-IPCprimary text-IPCprimary text-xs font-semibold uppercase tracking-widest hover:bg-IPCprimary hover:text-white transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Write Review
          </button>
        )}
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-6 bg-muted/10 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Submit Philatelic Condition Assessment
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Star Picker & Condition Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                Overall Grade / Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={20}
                      className={
                        s <= (hoverRating || rating)
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-neutral-300'
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-foreground ml-2">{hoverRating || rating} / 5</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                Philatelic Condition Status
              </label>
              <select
                value={conditionAssessment}
                onChange={(e) => setConditionAssessment(e.target.value)}
                className="w-full text-xs p-2.5 bg-background border border-border focus:outline-none focus:border-IPCprimary"
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
              Review Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Crisp impression, pristine original gum"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full text-xs p-2.5 bg-background border border-border focus:outline-none focus:border-IPCprimary"
              required
            />
          </div>

          {/* Comments */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
              Detailed Collector Notes & Critique
            </label>
            <textarea
              placeholder="Share observations on centering, perforation margins, paper freshness, or authenticity markings…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full text-xs p-2.5 bg-background border border-border focus:outline-none focus:border-IPCprimary resize-y"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {submitting && <Loader className="h-3.5 w-3.5 animate-spin" />}
              {submitting ? 'Publishing…' : 'Publish Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-border text-foreground text-xs font-semibold uppercase tracking-widest hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Ratings Breakdown Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-border p-6 bg-background">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 pr-0 md:pr-6 text-center space-y-2">
          <span className="text-4xl font-bold text-foreground font-serif">{stats.avgRating || '—'}</span>
          {renderStars(Math.round(stats.avgRating || 0), 18)}
          <span className="text-xs text-muted-foreground">
            Based on <span className="font-semibold text-foreground">{stats.totalReviews}</span> {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Distribution Bars */}
        <div className="md:col-span-2 space-y-2 justify-center flex flex-col">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.distribution?.[stars] || 0;
            const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-muted-foreground font-mono flex items-center gap-1 shrink-0">
                  {stars} <Star size={10} className="fill-amber-500 text-amber-500 inline" />
                </span>
                <div className="flex-1 h-2 bg-muted overflow-hidden border border-border/50">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-muted-foreground font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground tracking-widest uppercase">
            Loading Reviews…
          </div>
        ) : reviews.length === 0 ? (
          <div className="border border-border border-dashed p-10 text-center space-y-3">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No collector reviews yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Be the first philatelist to review and grade this stamp specimen.
            </p>
            {!user && (
              <p className="text-xs text-IPCprimary">Log in to write a review</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border border border-border bg-background">
            {reviews.map((r) => {
              const isOwner = user && (user._id === r.user?._id || user.id === r.user?._id);
              const isAdmin = user?.type === 'admin';

              return (
                <div key={r._id} className="p-6 space-y-3 hover:bg-muted/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* User info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {r.user?.profilePic ? (
                          <img src={r.user.profilePic} alt={r.user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{r.user?.fullName || 'Anonymous Collector'}</span>
                          {r.verifiedBuyer && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2">
                              <ShieldCheck className="h-3 w-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Condition badge & stars */}
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-border bg-muted/30 text-muted-foreground">
                        {r.conditionAssessment}
                      </span>
                      {renderStars(r.rating, 13)}

                      {(isOwner || isAdmin) && (
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-muted-foreground hover:text-IPCsecondary transition-colors p-1 cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="pl-11 space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">{r.headline}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{r.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default StampReviewsSection;
