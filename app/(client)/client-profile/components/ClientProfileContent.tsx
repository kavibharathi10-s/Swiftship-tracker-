import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Define Client type based on your Prisma model
interface Client {
  Id: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  photoUrl: string
  idPhotoUrl: string
  dateCreated: Date
  dateUpdated: Date
  isVerified: boolean
  selfieImage?: string
  activeJobs: any[] // Replace with proper type
  courierJobs: any[] // Replace with proper type
  Review: any[] // Replace with proper type
}

interface ClientProfileContentProps {
  loading: boolean
  error?: { message: string }
  client: Client | null
}

// Define tabs for client profile
const CLIENT_TABS = [
  { id: 'jobs', label: 'Active Jobs' },
  { id: 'history', label: 'Job History' },
  { id: 'reviews', label: 'Reviews' }
] as const

const ClientInfo = ({ client }: { client: Client }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <img
          src={client.photoUrl}
          alt={`${client.firstName} ${client.lastName}`}
          className="w-24 h-24 rounded-full object-cover"
        />
        <h2 className="text-xl font-semibold">
          {client.firstName} {client.lastName}
        </h2>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-sm">{client.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-sm">{client.phoneNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-sm">
            {new Date(client.dateCreated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

const ActiveJobsTab = ({ client }: { client: Client }) => {
  return (
    <div className="space-y-4">
      {client.activeJobs.length === 0 ? (
        <p className="text-gray-500">No active jobs</p>
      ) : (
        client.activeJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-4">
              {/* Add job details here */}
              <p>Job details...</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

const JobHistoryTab = ({ client }: { client: Client }) => {
  return (
    <div className="space-y-4">
      {client.courierJobs.length === 0 ? (
        <p className="text-gray-500">No job history</p>
      ) : (
        client.courierJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-4">
              {/* Add completed job details here */}
              <p>Completed job details...</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

const ReviewsTab = ({ client }: { client: Client }) => {
  return (
    <div className="space-y-4">
      {client.Review.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        client.Review.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              {/* Add review details here */}
              <p>Review details...</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export function ClientProfileContent({ loading, error, client }: ClientProfileContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {error.message}
      </div>
    )
  }

  if (!client) {
    return <div>Client not found</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Client Profile</h1>
          <Badge variant={client.isVerified ? "default" : "secondary"}>
            {client.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientInfo client={client} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="jobs">
              <TabsList className="grid grid-cols-3 gap-4">
                {CLIENT_TABS.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="jobs" className="mt-4">
                <ActiveJobsTab client={client} />
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <JobHistoryTab client={client} />
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <ReviewsTab client={client} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}