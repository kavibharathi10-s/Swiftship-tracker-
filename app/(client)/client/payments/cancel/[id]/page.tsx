'use client'

import { useState, useEffect } from 'react'
import { getJobById } from '@/actions/courierJobsActions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

type Job = {
  Id: string
  Title: string | null
  Budget: string | null
  // ... other fields as needed
}

export default function CancelPaymentPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const result = await getJobById(params.id)
        if (result.success && result.data) {
          setJob(result.data)
        } else {
          setError(result.error || 'Failed to load job')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [params.id])

  if (loading) {
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
          <CardTitle className="text-center text-2xl font-bold">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Cancelled</AlertTitle>
              <AlertDescription>
                Your payment for job &quot;{job?.Title}&quot; has been cancelled.
              </AlertDescription>
            </Alert>
            <p className="text-center text-gray-600">
              As a result of this cancellation, the delivery for this job will also be cancelled.
            </p>
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