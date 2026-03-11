/**
 * Custom hook to fetch expense categories from the backend API.
 */

import { useEffect, useState } from "react";
import { fetchCategories } from "../services/api";

export interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Prevent state updates if the component unmounts before the request finishes
    let isMounted = true;

    async function loadCategories() {
      try {
        setLoading(true);
        setError(null); 

        const data = await fetchCategories();

        if (isMounted) {
          if (!Array.isArray(data)) {
            throw new Error("Invalid categories response");
          }

          setCategories(data);
        }
      } catch (err: unknown) {
        console.error("Failed to load categories:", err);

        if (!isMounted) return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unexpected error occurred while loading categories");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    // Cleanup to avoid memory leaks if component unmounts during fetch
    return () => {
      isMounted = false; 
    };
  }, []);

  return { categories, error, loading };
}