import React, { useRef, useState } from 'react'
import { LuTrash, LuUpload, LuUser } from 'react-icons/lu'

const ProfilePhotoSelector = ({image,setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl,setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setImage(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleImageRemove = (e) => {
        setImage(null)
        setPreviewUrl(null)
    }

    const onChooseFile = () => {
        inputRef.current.click()
    }

  return (
    <div className='flex flex-col items-center gap-3 mb-6'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        className='hidden'
        onChange={handleImageChange}
      />

      {!image ? (
        <div
          className='w-24 h-24 flex items-center justify-center bg-[#DA1C1C] rounded-full relative cursor-pointer hover:shadow-md transition'
          onClick={onChooseFile}
        >
          <LuUser className='text-4xl text-[#DA1C1C]' />
          <div className='absolute bottom-0 right-0 bg-[#DA1C1C] text-white p-1 rounded-full'>
            <LuUpload className='text-sm' />
          </div>
        </div>
      ) : (
        <div className='relative w-24 h-24'>
          <img
            src={previewUrl}
            alt='profile'
            className='w-24 h-24 object-cover rounded-full shadow-md'
          />
          <button
            type='button'
            onClick={handleRemoveImage}
            className='absolute -top-0 -right-0 bg-[#DA1C1C] text-white p-1 rounded-full shadow-md hover:bg-teal-600 transition'
          >
            <LuTrash className='text-sm' />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector
