import React from 'react';
import AddCardForm from '../components/AddCardForm';
import './AddCardPage.css'; // For page-specific styling

const AddCardPage = () => {
  return (
    <div className="add-card-page">
      <h1>Add New Loyalty Card</h1>
      <AddCardForm />
    </div>
  );
};

export default AddCardPage;
