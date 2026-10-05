// components/CreateClientReview.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Star, StarIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  content: z.string().min(10, 'Review must be at least 10 characters').max(500),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface CreateClientReviewProps {
  clientId: string
  driverId: string
  onSuccess?: () => void
}

export function CreateClientReview({ clientId, driverId, onSuccess }: CreateClientReviewProps) {
  const { user, isLoaded, isSignedIn } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: '',
    },
  })

  const rating = form.watch('rating')

  const onSubmit = async (data: ReviewFormData) => {
    if (!isLoaded || !isSignedIn) {
      toast.error('Please sign in to submit a review')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/client-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          clientId,
          driverId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      toast.success('Review submitted successfully')
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review')
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Please sign in to submit a review
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Rate Your Client</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl focus:outline-none"
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(null)}
                          onClick={() => field.onChange(star)}
                        >
                          {star <= (hoveredStar ?? rating) ? (
                            <Star className="w-8 h-8 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-8 h-8 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your review here..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}