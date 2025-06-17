import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCardToStorage } from '../utils/localStorage';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css'; // Import camera CSS
import './AddCardForm.css';

const AddCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cardNumber || !storeName) {
      alert('Please fill in both Card Number and Store Name.');
      return;
    }
    addCardToStorage({ cardNumber, storeName });
    alert('Card added successfully!');
    setCardNumber('');
    setStoreName('');
    navigate('/'); // Redirect to Home page
  };

  const handleTakePhoto = (dataUri) => {
    console.log('Photo taken:', dataUri);
    // For now, just log the data.
    // Later, this dataUri could be sent to a server for processing or processed client-side.
    alert('Photo captured! Check console for data URI.');
    setShowCamera(false); // Hide camera after photo is taken
  };

  if (showCamera) {
    return (
      <div className="camera-container">
        <Camera
          onTakePhotoAnimationDone={handleTakePhoto}
          idealFacingMode="environment" // Prefer rear camera
        />
        <button onClick={() => setShowCamera(false)} className="close-camera-btn">
          Close Camera
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <div className="form-group">
        <label htmlFor="storeName">Store Name:</label>
        <input
          type="text"
          id="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number:</label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">Add Card</button>
        <button
          type="button"
          onClick={() => setShowCamera(true)}
          className="photo-btn"
        >
          Add by Photo
        </button>
      </div>
    </form>
  );
};

export default AddCardForm;
