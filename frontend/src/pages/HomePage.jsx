import React from 'react'
import { axiosInstance } from '../lib/axios.js';
import { useState } from 'react';


const Home = () => {
  const [base64Image, setBase64Image] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setBase64Image(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogin = () => {
    axiosInstance.post('/auth/login', {
    email: "mourya@example.com",
    password: "test123"
  })
      .then(res => {
        console.log("Login successful:", res.data);
      })
      .catch(error => {
        console.error("Error logging in:", error);
      });
  };

  const handleImageUpload = () => {
    if (!base64Image) {
      console.error("No image selected for upload");
      return;
    }
    axiosInstance.post('/stamps/new', {
      title: "Sample Stamp",
      country: "USA",
      year: 2023,
      category: "Commemorative",
      description: "A sample stamp for testing.",
      image: base64Image,
      isForSale: true,
      price: 10.00,
      isMuseumPiece: false
    })
      .then(res => {
        console.log("Image uploaded successfully:", res.data);
        setBase64Image(null); // Clear the image after upload
      })
      .catch(error => {
        console.error("Error uploading image:", error);
      });
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={handleLogin}>Login</button>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <br />
      <button onClick={handleImageUpload}>Upload Image</button>
      <button onClick={() => setBase64Image(null)}>Clear Image</button>
      <br />
      {base64Image && (
        <div>
          <h2>Base64 Image:</h2>
          <img src={base64Image} alt="Selected" style={{ maxWidth: '300px', maxHeight: '300px' }} />
        </div>
      )}
    </div>
  )
}

export default Home