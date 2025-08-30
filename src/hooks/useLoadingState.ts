import { useState, useEffect } from "react";

export interface LoadingConfig {
  minLoadTime?: number;
  showProgress?: boolean;
  stages?: string[];
}

export const useLoadingState = (config: LoadingConfig = {}) => {
  const { minLoadTime = 1000, showProgress = false, stages = [] } = config;

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stageInterval: NodeJS.Timeout;

    if (showProgress) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
    }

    if (stages.length > 0) {
      stageInterval = setInterval(() => {
        setCurrentStage((prev) => (prev + 1) % stages.length);
      }, 800);
    }

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        if (progressInterval) clearInterval(progressInterval);
        if (stageInterval) clearInterval(stageInterval);
      }, 300);
    }, minLoadTime);

    return () => {
      clearTimeout(timer);
      if (progressInterval) clearInterval(progressInterval);
      if (stageInterval) clearInterval(stageInterval);
    };
  }, [minLoadTime, showProgress, stages.length]);

  const startLoading = (newStages?: string[]) => {
    setIsLoading(true);
    setProgress(0);
    setCurrentStage(0);
    setError(null);
    if (newStages) {
      // Update stages dynamically if needed
    }
  };

  const setLoadingError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => setIsLoading(false), 300);
  };

  return {
    isLoading,
    progress,
    currentStage: stages[currentStage] || "",
    error,
    startLoading,
    setLoadingError,
    finishLoading,
  };
};

// Hook for API calls with loading states
export const useAsyncOperation = <T>(
  operation: () => Promise<T>,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: any[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (deps.length > 0) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    isLoading,
    error,
    execute,
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    },
  };
};

// Hook for form submission with loading states
export const useFormSubmission = <T>() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitForm = async (submitFn: () => Promise<T>) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const result = await submitFn();
      setSubmitSuccess(true);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Submission failed";
      setSubmitError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmission = () => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  };

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitForm,
    resetSubmission,
  };
};
