import React, { useRef } from 'react';
import { LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      <button
        type="button"
        onClick={onChooseFile}
        className="flex items-center gap-2 px-2 py-1 bg-[#DA1C1C] text-white rounded-full hover:bg-[#b71717] transition"
      >
        <LuUpload className="text-lg" />
        {image ? "Change Image" : "Upload Image"}
      </button>

      {image && (
        <button
          type="button"
          onClick={handleImageRemove}
          className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition"
        >
          <LuTrash className="text-lg" />
          Remove
        </button>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;