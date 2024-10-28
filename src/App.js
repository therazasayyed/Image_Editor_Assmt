import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import CanvasEditor from './components/CanvasEditor';

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`https://pixabay.com/api/?key=46748726-f59b77e77e98d1c215b68dcdc&q=${query}`);
      setImages(response.data.hits);
    } catch (error) {
      console.error("Error fetching images", error);
    }
  };

  return (
    <div className="App">
      <h1>Image Editor for Captions</h1>
      <input type="text" onBlur={(e) => handleSearch(e.target.value)} placeholder="Search for images" />
      <div className="image-results">
        {images.map((img) => (
          <img key={img.id} src={img.webformatURL} alt={img.tags} onClick={() => setSelectedImage(img.largeImageURL)} />
        ))}
      </div>
      {selectedImage && <CanvasEditor imageUrl={selectedImage} />}
    </div>
  );
};

export default App;

