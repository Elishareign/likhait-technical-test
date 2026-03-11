/**
 * Form component for adding custom categories
 */

import React, { useState } from "react";
import { Button, TextField } from "../vibes";
import { CategoryFormData } from "../types";
import { useCategoryForm } from "../hooks/useCategoryForm";

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Category",
}: CategoryFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit: handleFormSubmit } =
    useCategoryForm({
      initialData,
      onSubmit,
    });

  // Stores server-side submission errors
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null); 
    try {
      await handleFormSubmit(e);
    } catch (err: any) {
      console.error("Category submission failed:", err);
      setSubmitError(err?.message || "Failed to submit category");
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {submitError && (
        <div style={{ color: "red", fontSize: "0.85rem" }}>{submitError}</div>
      )}

      <TextField
        label="Category Name"
        type="text"
        placeholder="Enter category name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        maxLength={100}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}