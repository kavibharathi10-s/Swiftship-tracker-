import { Driver } from '@/types/driver'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TABS } from '@/types/driver'
import { VehicleTab } from './VehicleTab'
import { DocumentsTab } from './DocumentsTab'
import { ActivityTab } from './ActivityTab'
import DriverInfo from './DriverInfo'
import { ReviewSection } from './ReviewSection'

interface DriverProfileContentProps {
  loading: boolean
  error?: { message: string }
  driver: Driver | null
}

export function DriverProfileContent({ loading, error, driver }: DriverProfileContentProps) {
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

  if (!driver) {
    return <div>Driver not found</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Driver Profile</h1>
          <Badge variant={driver.isVerified ? "default" : "secondary"}>
            {driver.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <DriverInfo driver={driver} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="vehicle">
              <TabsList className="grid grid-cols-3 gap-4">
                {TABS.filter(tab => tab.id !== 'reviews').map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="vehicle" className="mt-4">
                <VehicleTab driver={driver} />
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <DocumentsTab driver={driver} />
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <ActivityTab driver={driver} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewSection />
        </CardContent>
      </Card>
    </div>
  )
}