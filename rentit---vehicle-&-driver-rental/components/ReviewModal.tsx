
import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  bookingId: number;
  revieweeName?: string; // Name of the person/vehicle being reviewed
  title?: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ bookingId, revieweeName, title, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }} onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10">
            <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white text-center">{title || 'Rate Your Experience'}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
            {revieweeName ? `How was your experience with ${revieweeName}?` : `How was your experience for Booking #${bookingId}?`}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110 focus:outline-none p-1"
                >
                  <Star 
                    size={36} 
                    className={`${(hoveredStar || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <div className="text-center font-medium text-slate-700 dark:text-slate-300 h-6">
                {hoveredStar === 1 && "Terrible"}
                {hoveredStar === 2 && "Bad"}
                {hoveredStar === 3 && "Okay"}
                {hoveredStar === 4 && "Good"}
                {hoveredStar === 5 && "Excellent"}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Leave a comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none transition-all resize-none text-slate-900 dark:text-white"
                placeholder="Share your feedback..."
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-accent-500 text-white py-3 px-4 rounded-lg hover:bg-accent-600 font-bold shadow-lg transform transition-transform active:scale-95"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};

export default ReviewModal;
