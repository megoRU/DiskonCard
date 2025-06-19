import React from "react";
import AddCardForm from "../components/AddCardForm.jsx"; // Updated import
import { useTranslation } from "react-i18next";
import "./AddCardPage.css"; // For page-specific styling

const AddCardPage = () => {
  const { t } = useTranslation();
  return (
    <div className="add-card-page">
      <h1>{t("addCardPage.title")}</h1>
      <AddCardForm />
    </div>
  );
};

export default AddCardPage;
