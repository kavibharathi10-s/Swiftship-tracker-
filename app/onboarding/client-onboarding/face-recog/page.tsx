import React from 'react'
import PhotoCapture from '@/screens/client/components/FaceMeshVerification'

export default function Face() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 pt-24'>
      <PhotoCapture />
    </div>
  )
}