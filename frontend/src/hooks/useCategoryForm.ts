/**
 * Custom hook for managing category form state with real-time validation
 */

import { useState } from "react";
import { CategoryFormData } from "../types";

interface UseCategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

// Allow only letters, numbers, spaces, and selected safe characters
const CATEGORY_NAME_REGEX = /^[A-Za-z0-9\s\-&()]+$/; 
const MAX_NAME_LENGTH = 100;
const MIN_NAME_LENGTH = 2;

export function useCategoryForm({
  initialData,
  onSubmit,
}: UseCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field-level validation
  const validateField = (field: keyof CategoryFormData, value: string) => {
    let error: string | undefined;

    const trimmed = value.trim();

    if (field === "name") {
      if (!trimmed) error = "Category name is required";
      else if (trimmed.length < MIN_NAME_LENGTH)
        error = `Category name must be at least ${MIN_NAME_LENGTH} characters`;
      else if (trimmed.length > MAX_NAME_LENGTH)
        error = `Category name must be less than ${MAX_NAME_LENGTH} characters`;
      else if (!CATEGORY_NAME_REGEX.test(trimmed))
        error = "Category name contains invalid characters";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const isValid = validateField("name", formData.name);
    return isValid;
  };

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    // Normalize multiple spaces into a single space
    const sanitizedValue = value.replace(/\s+/g, " "); 

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    validateField(field, sanitizedValue); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent duplicate form submissions
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Trim whitespace before submitting data to backend
      const sanitizedData = { name: formData.name.trim() };
      await onSubmit(sanitizedData);

      setFormData({ name: "" });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: initialData?.name ?? "" });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}