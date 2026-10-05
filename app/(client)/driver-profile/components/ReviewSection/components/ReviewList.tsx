import { DriverReview } from '@/types/driver'
import { ReviewCard } from './ReviewCard'
import { ReviewSkeleton } from './ReviewSkeleton'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface ReviewListProps {
  reviews: DriverReview[]
  isLoading: boolean
  isError: boolean
  onDeleteReview: (reviewId: string) => void
  deletingReviewId: string | null
}

export const ReviewList = ({ reviews, isLoading, isError, onDeleteReview, deletingReviewId }: ReviewListProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: isLoading ? 5 : reviews.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  })

  if (isError) {
    return (
      <p className="text-red-500 text-center py-4" role="alert">
        Error loading reviews. Please try again later.
      </p>
    )
  }

  return (
    <div 
      ref={parentRef}
      className="space-y-4 max-h-[500px] overflow-y-auto pr-4 -mr-4"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {isLoading ? (
              <ReviewSkeleton />
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            ) : (
              <ReviewCard
                key={reviews[virtualRow.index].id}
                review={reviews[virtualRow.index]}
                onDelete={onDeleteReview}
                isDeleting={deletingReviewId === reviews[virtualRow.index].id}
              />
            )}
          </div>
        ))}
      </div>
      {!isLoading && reviews.length === 0 && (
        <p className="text-gray-500 text-center py-4">No reviews available</p>
      )}
    </div>
  )
}