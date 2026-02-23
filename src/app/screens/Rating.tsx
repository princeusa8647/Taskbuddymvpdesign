import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

const ratingTags = ['On Time', 'Neat Work', 'Friendly', 'Fast Response', 'Professional', 'Quality Work'];

export function Rating() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, submitReview, currentUser } = useApp();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  if (job.status === 'COMPLETED') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2">Already Rated</h2>
            <p className="text-gray-600">You have already submitted a review for this job.</p>
            <Button onClick={() => navigate('/customer')} className="mt-4">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    if (!job.providerId || !currentUser) return;

    submitReview({
      jobId: job.id,
      providerId: job.providerId,
      customerId: currentUser.id,
      rating,
      text: reviewText,
      tags: selectedTags,
      customerName: currentUser.name,
    });

    toast.success('Review submitted successfully!');
    navigate('/customer');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Rate & Review</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>How was your experience?</CardTitle>
            <p className="text-sm text-gray-600">
              Your feedback helps others make better decisions
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Provider Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                {job.providerName?.charAt(0) || 'P'}
              </div>
              <div>
                <div className="font-semibold">{job.providerName}</div>
                <div className="text-sm text-gray-600">{job.workType}</div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                {rating === 0 && 'Tap to rate'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Below Average'}
                {rating === 3 && 'Average'}
                {rating === 4 && 'Good'}
                {rating === 5 && 'Excellent'}
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label htmlFor="review">Write your review</Label>
              <Textarea
                id="review"
                placeholder="Share details of your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Select tags (optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                {ratingTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2 border rounded-lg p-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={tag} className="cursor-pointer flex-1 text-sm">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={rating === 0 || !reviewText.trim()}
            >
              Submit Review
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
