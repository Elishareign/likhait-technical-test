/**
 * Custom hook for managing category form state and validation
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

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    // Normalize multiple spaces into a single space
    const sanitizedValue = value.replace(/\s+/g, " "); 

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};
    const name = formData.name.trim();

    // Required validation
    if (!name) {
      newErrors.name = "Category name is required";
    }

    // Minimum length
    else if (name.length < MIN_NAME_LENGTH) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    // Maximum length
    else if (name.length > MAX_NAME_LENGTH) {
      newErrors.name = "Category name must be less than 100 characters";
    }

    // Allowlist validation (OWASP recommendation)
    else if (!CATEGORY_NAME_REGEX.test(name)) {
      newErrors.name =
        "Category name contains invalid characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate form submissions
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Trim whitespace before submitting data to backend
      const sanitizedData = {
        name: formData.name.trim(),
      };

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
    setFormData({
      name: initialData?.name ?? "",
    });

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