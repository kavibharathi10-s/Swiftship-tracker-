import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ClientProfileSkeleton } from '../components/client-profile-skeleton.';
import { ClientProfileContent } from '../components/client-profile-content';
import { ClientProfileProps } from '@/types/clients';
import CreateClientReview from '../components/create-profile';

async function getClientData(id: string) {
  const client = await prisma.clients.findUnique({
    where: { Id: id },
    include: {
      courierJobs: true,
      ClientReview: {
        include: {
          driver: true,
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return client;
}

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
  const clientData = await getClientData(params.id);

  const client = clientData.Id
  const driverId = 'user_2msxfh6QIiMFhIAbgEog7Qiecc7'
  return (
    <Suspense fallback={<ClientProfileSkeleton />}>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ClientProfileContent client={clientData as ClientProfileProps['client']} />
      
      <CreateClientReview 
        clientId={client}
        driverId={driverId}
      />
      </div>
    </Suspense>
  );
}