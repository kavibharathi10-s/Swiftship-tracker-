'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { DriverProfileState } from '@/types/driver';
import { DriverProfileContent } from '../components/DriverProfileContent';

// Define page props interface
interface PageProps {
  params: { id: string };
}

const DriverProfile = ({ params }: PageProps) => {
  const driverId = params.id;
  
  const [state, setState] = useState<DriverProfileState>({
    driver: null,
    loading: true,
    error: undefined
  });

  useEffect(() => {
    if (!driverId) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          status: 400,
          message: 'Driver ID is required'
        }
      }));
      return;
    }
  
    const fetchDriver = async () => {
      try {
        const response = await fetch(`/api/drivers/${driverId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setState({ 
          driver: data, 
          loading: false,
          error: undefined 
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setState(prev => ({ 
          ...prev,
          loading: false,
          error: {
            status: 500,
            message: error instanceof Error ? error.message : 'An error occurred'
          }
        }));
      }
    };
  
    fetchDriver();
  }, [driverId]);

  return <DriverProfileContent {...state} />;
};

export default DriverProfile;