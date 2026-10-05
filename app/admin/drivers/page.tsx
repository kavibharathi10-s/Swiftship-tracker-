'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllDrivers } from '@/actions/driverActions'
import { toast } from '@/hooks/use-toast'
import { Truck } from 'lucide-react'

type Driver = {
  Id: string
  email: string
  phoneNumber: string | null
  firstName: string
  lastName: string
  vehicleType: string | null
  isVerified: boolean
}

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const getDrivers =  async () => {
      const allDrivers = await getAllDrivers()
      setLoading(false)
      if (allDrivers.success && allDrivers.data) {
        setDrivers(allDrivers.data as Driver[])
    } else {
      toast({
        title: 'Error',
        description: 'Failed to fetch drivers',
        variant: 'destructive',
      })
    }
  }
  getDrivers()
  })

  const filteredDrivers = drivers.filter(driver => 
    driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
    {
      loading &&  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
      {/* Animated Delivery Truck */}
      <Truck className="animate-truck" width="100" height="100" />
      <p className="text-lg text-gray-700">____________________</p>
    </div>
    }
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Drivers</h1>
      <Input
        placeholder="Search drivers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      {/* Table for larger screens */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.Id}>
                <TableCell>
                  <Link href={`/admin/drivers/${driver.Id}`} className="hover:underline">
                    {driver.firstName} {driver.lastName}
                  </Link>
                </TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.phoneNumber || 'N/A'}</TableCell>
                <TableCell>{driver.vehicleType || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={driver.isVerified ? "secondary" : "outline"}>
                    {driver.isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Cards for mobile screens */}
      <div className="md:hidden space-y-4">
        {filteredDrivers.map((driver) => (
          <Card key={driver.Id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/admin/drivers/${driver.Id}`} className="hover:underline">
                  {driver.firstName} {driver.lastName}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Email:</strong> {driver.email}</p>
              <p><strong>Phone:</strong> {driver.phoneNumber || 'N/A'}</p>
              <p><strong>Vehicle Type:</strong> {driver.vehicleType || 'N/A'}</p>
              <p><strong>Status:</strong> 
                <Badge variant={driver.isVerified ? "secondary" : "outline"} className="ml-2">
                  {driver.isVerified ? 'Verified' : 'Pending'}
                </Badge>
              </p>
            </CardContent>
          </Card>
        ))}      </div>
    </div>
    </>
  )
}