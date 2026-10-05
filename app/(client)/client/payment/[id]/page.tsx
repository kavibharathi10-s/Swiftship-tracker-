'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { getJobById } from '@/actions/courierJobsActions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Job = {
  Id: string
  Title: string | null
  Budget: string | null
  Description: string | null
  // ... other fields as needed
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmPayment, setConfirmPayment] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

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

  const handlePayment = async () => {
    if (!job) return
    
    setProcessingPayment(true)
    try {
      const stripe = await stripePromise
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: params.id, amount: job.Budget }),
      })

      if (!res.ok) throw new Error('Payment initiation failed')

      const { sessionId } = await res.json()
      const result = await stripe?.redirectToCheckout({ sessionId })
      
      if (result?.error) {
        throw new Error(result.error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
    } finally {
      setProcessingPayment(false)
    }
  }

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

  if (!job) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Job Not Found</AlertTitle>
        <AlertDescription>The requested job could not be found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment for Job: {job.Title}</CardTitle>
          <CardDescription>Review the job details before proceeding to payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Job Description</h3>
              <p>{job.Description || 'No description provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Amount</h3>
              <p className="text-2xl font-bold">M{job.Budget}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {!confirmPayment ? (
            <Button 
              onClick={() => setConfirmPayment(true)}
              className="w-full"
            >
              Proceed to Payment
            </Button>
          ) : (
            <>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Confirm Payment</AlertTitle>
                <AlertDescription>
                  You are about to make a payment of M{job.Budget} for the job "{job.Title}". 
                  Click "Pay Now" to proceed to Stripe's secure payment page.
                </AlertDescription>
              </Alert>
              <div className="flex space-x-4 w-full">
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmPayment(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="w-full"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}