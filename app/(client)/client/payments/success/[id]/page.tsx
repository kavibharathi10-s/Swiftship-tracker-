'use client'

import { useState, useEffect } from 'react'
import { getJobById, updateJobPaymentStatus } from '@/actions/courierJobsActions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type Job = {
  Id: string
  Title: string | null
  Budget: string | null
  isPaid: boolean
  // ... other fields as needed
}

export default function SuccessPaymentPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchJobAndUpdateStatus = async () => {
      try {
        const result = await getJobById(params.id)
        if (result.success && result.data) {
          setJob(result.data)
          if (!result.data.isPaid) {
            setUpdating(true)
            const updateResult = await updateJobPaymentStatus(params.id, true)
            if (updateResult.success) {
              setJob(prev => prev ? { ...prev, isPaid: true } : null)
            } else {
              throw new Error(updateResult.error || 'Failed to update payment status')
            }
          }
        } else {
          throw new Error(result.error || 'Failed to load job')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setLoading(false)
        setUpdating(false)
      }
    }
    fetchJobAndUpdateStatus()
  }, [params.id])

  if (loading || updating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Payment Successful</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <Alert variant="default" className="border-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Payment Confirmed</AlertTitle>
              <AlertDescription>
                Your payment of M{job?.Budget} for job &quot;{job?.Title}&quot; has been successfully processed.
              </AlertDescription>
            </Alert>
            <p className="text-center text-gray-600">
              The courier has been notified and will start preparing for the delivery.
            </p>
            <div className="text-center">
              <p className="font-semibold">Payment Status:</p>
              <p className="text-green-600">{job?.isPaid ? 'Paid' : 'Processing'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/jobs">View All Jobs</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/jobs/${job?.Id}`}>Return to Job Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}