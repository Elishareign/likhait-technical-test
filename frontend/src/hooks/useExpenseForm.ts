/**
 * Custom hook for managing expense form state with real-time validation
 */

import { useState } from "react";
import { ExpenseFormData } from "../types";
import { formatDate } from "../utils/expenseUtils";

interface UseExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
}

export function useExpenseForm({ initialData, onSubmit }: UseExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    date: initialData?.date || formatDate(new Date()),
  });

  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof ExpenseFormData, value: string) => {
    let error: string | undefined;

    switch (field) {
      case "amount":
        const num = Number(value);
        if (!value) error = "Amount is required";
        else if (isNaN(num) || num <= 0) error = "Amount must be greater than 0";
        else if (num > 1000000) error = "Amount exceeds allowed limit";
        break;

      case "description":
        const trimmed = value.trim();
        const regex = /^[a-zA-Z0-9\s.,'-]+$/; 
        if (!trimmed) error = "Description is required";
        else if (trimmed.length < 3) error = "Description must be at least 3 characters";
        else if (trimmed.length > 255) error = "Description must be less than 255 characters";
        else if (!regex.test(trimmed)) error = "Description contains invalid characters";
        break;

      case "category":
        if (!value) error = "Category is required";
        break;

      case "date":
        if (!value) error = "Date is required";
        else {
          const selected = new Date(value + "T00:00:00");
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (isNaN(selected.getTime())) error = "Invalid date";
          else if (selected.getTime() > today.getTime())
            error = "Expense date cannot be in the future";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const fields: (keyof ExpenseFormData)[] = ["amount", "description", "category", "date"];
    let isValid = true;
    fields.forEach((field) => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });
    return isValid;
  };

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        amount: "",
        description: "",
        category: "",
        date: formatDate(new Date()),
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: initialData?.amount || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      date: initialData?.date || formatDate(new Date()),
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