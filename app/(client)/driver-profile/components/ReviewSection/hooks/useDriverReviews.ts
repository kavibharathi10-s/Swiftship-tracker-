import { useState, useEffect } from 'react'
import { DriverReview } from '@/types/driver'
import { useToast } from "@/hooks/use-toast"

export const useDriverReviews = (driverId: string | undefined) => {
  const [reviews, setReviews] = useState<DriverReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReviews = async () => {
      if (!driverId) return
      
      setIsLoading(true)
      try {
        const response = await fetch(`/api/drivers/${driverId}/get-reviews`)
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to fetch reviews',
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [driverId, toast])

  const addReview = (newReview: DriverReview) => {
    setReviews([...reviews, newReview])
  }

  const removeReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId))
  }

  return { reviews, isLoading, addReview, removeReview }
}