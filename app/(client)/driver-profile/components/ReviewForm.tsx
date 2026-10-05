import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {

  driverId: string;

  onClose: () => void;

  isSubmitting: boolean;

}


export function ReviewForm({ driverId, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');  // Changed from 'comment' to match API schema
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please provide a review content",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting review:', { rating, content });
      const response = await fetch(`/api/drivers/${driverId}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          rating, 
          content
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit review',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <Star 
                className={`h-6 w-6 ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Your Review
        </label>
        <Textarea
          id="content"
          placeholder="Share your experience with this driver..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex space-x-2 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || rating === 0 || !content.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}