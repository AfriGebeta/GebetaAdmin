import { CameraIcon, ImageIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '@/services/api.ts'
import useLocalStorage from '@/hooks/use-local-storage.tsx'

interface ImagesEditorProps {
  value: any
  onChange: (value: any) => void
}

export function ImagesEditor({ value, onChange }: ImagesEditorProps) {
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const handleDeleteImage = (image: string) => {
    const newImages = value.filter((img) => img !== image)
    onChange(newImages)
    //todo delete image from storage
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target?.files[0]
      try {
        const response = await api.getPreSignedUrl({
          apiAccessToken: String(apiAccessToken),
        })
        const result = await response.json()

        if (result?.data && result?.data.url && result?.data.sasToken) {
          const uploadUrl = `${result?.data.url}/${file.name}?${result?.data.sasToken}`

          const uploadResponse = await api.uploadImage({
            file: file,
            uploadUrl: uploadUrl,
          })
          if (uploadResponse.ok) {
            const imageUrl = `${result.data.url}/${file.name}`
            onChange([...value, imageUrl])
          }
        } else {
          console.error('Failed to upload image')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }

  return (
    <div className='flex flex-col gap-6 text-center'>
      <div className='flex items-center justify-start gap-2'>
        {value.length > 0 ? (
          value.map((image, index) => {
            return (
              <div key={index} className='relative'>
                <img
                  src={String(image)}
                  alt={index + 1}
                  className='w-24 shrink-0 bg-red-100 object-contain'
                />

                <div
                  className='absolute right-1 top-1 rounded bg-[#ecedef] p-1 hover:opacity-75'
                  onClick={() => handleDeleteImage(image)}
                >
                  <XIcon size={18} />
                </div>
              </div>
            )
          })
        ) : (
          <p className='text-center text-sm text-gray-600'>No Images</p>
        )}
      </div>
      <div className='flex h-[280px] flex-col items-center gap-6 pt-8'>
        <div className='bg-grey-400 cursor-pointer border border-2 border-dashed'>
          <div className='flex h-[100px] w-[200px] flex-col items-center justify-center'>
            <label
              htmlFor='files'
              className='flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-gray-400'
            >
              <ImageIcon size={20} className='text-center text-gray-400' />
              Upload your images
            </label>
            <input
              id='files'
              type='file'
              className='hidden'
              onChange={handleImage}
              accept='image/*'
            />
          </div>
        </div>
        <div className='bg-grey-400 cursor-pointer border border-2 border-dashed'>
          <div className='flex h-[100px] w-[200px] flex-col items-center justify-center'>
            <CameraIcon size={20} className='text-center text-gray-400' />
            <span className='mt-2 text-sm text-gray-400'>Take photos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
