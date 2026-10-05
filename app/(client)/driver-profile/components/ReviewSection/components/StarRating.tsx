import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => (
  <div className="flex space-x-1">
    {[...Array(5)].map((_, i) =>
      i < rating ? (
        <Star key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      )
    )}
  </div>
);
