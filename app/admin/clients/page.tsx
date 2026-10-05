'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllClients } from '@/actions/clientActions'
import { toast } from '@/hooks/use-toast'
import { Truck } from 'lucide-react'
import { Badge } from "@/components/ui/badge"


type Client = {
  Id: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  isVerified: boolean
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getClients = async () => {
      const allClients = await getAllClients()

      if (allClients.success && allClients.data) {
        setClients(allClients.data as Client[])
        setLoading(false)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch clients',
          variant: 'destructive',
        })
      }
    }
    getClients()
  })

  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h1 className="text-2xl font-bold">Clients</h1>
      <Input
        placeholder="Search clients..."
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.Id}>
                <TableCell>
                  <Link href={`/admin/clients/${client.Id}`} className="hover:underline">
                    {client.firstName} {client.lastName}
                  </Link>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>
                  <Badge variant={client.isVerified ? "secondary" : "outline"}>
                    {client.isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Cards for mobile screens */}
      <div className="md:hidden space-y-4">
        {filteredClients.map((client) => (
          <Card key={client.Id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/admin/clients/${client.Id}`} className="hover:underline">
                  {client.firstName} {client.lastName}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phoneNumber}</p>
              <p><strong>Status:</strong> <Badge variant={client.isVerified ? "secondary" : "outline"}>
                    {client.isVerified ? 'Verified' : 'Pending'}
                  </Badge></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </>
  )
}