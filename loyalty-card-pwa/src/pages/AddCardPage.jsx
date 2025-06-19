import React from "react";
import AddCardForm from "../components/AddCardForm.jsx"; // Updated import
import "./AddCardPage.css"; // For page-specific styling

const AddCardPage = () => {
  return (
    <div className="add-card-page">
      <h1>Добавление карты</h1>
      <AddCardForm />
    </div>
  );
};

export default AddCardPage;
