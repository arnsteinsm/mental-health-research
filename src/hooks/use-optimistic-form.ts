// src/hooks/use-optimistic-form.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState, useTransition } from 'react';

interface FormState<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

interface FormOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  invalidateQueries?: string[];
}

// Modern form hook with optimistic updates using TanStack Query
export function useOptimisticForm<T>(
  mutationFn: (formData: FormData) => Promise<T>,
  options: FormOptions<T> = {}
) {
  const { initialData, onSuccess, onError, invalidateQueries = [] } = options;
  const queryClient = useQueryClient();

  const [state, setState] = useState<FormState<T>>({
    data: initialData || null,
    error: null,
    success: false,
  });

  // React 19: useTransition for non-urgent updates
  const [isPending, startTransition] = useTransition();

  // TanStack Query mutation with optimistic updates
  const mutation = useMutation({
    mutationFn,
    onMutate: async (formData) => {
      // Cancel outgoing refetches
      await Promise.all(
        invalidateQueries.map((key) => queryClient.cancelQueries({ queryKey: [key] }))
      );

      // Snapshot previous values for rollback
      const previousData = invalidateQueries.map((key) => ({
        key,
        data: queryClient.getQueryData([key]),
      }));

      return { previousData };
    },
    onSuccess: (data) => {
      setState({
        data,
        error: null,
        success: true,
      });

      // Invalidate and refetch queries
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      onSuccess?.(data);
    },
    onError: (error, _variables, context) => {
      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ key, data }) => {
          queryClient.setQueryData([key], data);
        });
      }

      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({
        data: null,
        error: errorMessage,
        success: false,
      });

      onError?.(errorMessage);
    },
  });

  // Enhanced submit with transitions
  const submitForm = useCallback(
    (formData: FormData) => {
      setState((prev) => ({ ...prev, error: null, success: false }));

      startTransition(() => {
        mutation.mutate(formData);
      });
    },
    [mutation]
  );

  // Create form action for React 19 form integration
  const formAction = useCallback(
    (formData: FormData) => {
      submitForm(formData);
    },
    [submitForm]
  );

  return {
    state,
    formAction,
    submitForm,
    isPending: isPending || mutation.isPending,
    isSuccess: state.success,
    isError: !!state.error,
    error: state.error,
    reset: () =>
      setState({
        data: initialData || null,
        error: null,
        success: false,
      }),
  };
}
