export const hookTemplates = {
  state: (name) => `/**
* A custom state management hook for ${name}
* @template T - The type of state to manage
* @returns [state: T, setState: (value: T) => void]
*/
export const use${name} = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);

  const handleState = useCallback((value: T) => {
      setState(value);
  }, []);

  return [state, handleState] as const;
};`,

  effect: (name) => `/**
* A custom effect hook for ${name}
* @template T - The type of data to handle
* @param {function} callback - The effect callback
* @param {any[]} deps - Dependencies array
*/
export const use${name} = <T>(callback: () => Promise<T> | void, deps: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
      const execute = async () => {
          try {
              setLoading(true);
              setError(null);
              const result = await callback();
              if (result !== undefined) {
                  setData(result);
              }
          } catch (err) {
              setError(err instanceof Error ? err : new Error('An error occurred'));
          } finally {
              setLoading(false);
          }
      };

      execute();
  }, deps);

  return { data, loading, error };
};`,

  ref: (name) => `/**
* A custom ref hook for ${name}
* @template T - The type of ref to manage
* @returns React.RefObject<T>
*/
export const use${name} = <T,>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
      // Setup effect if needed
      return () => {
          // Cleanup if needed
      };
  }, []);

  return ref;
};`,

  form: (name) => `/**
* A custom form management hook for ${name}
* @template T - The type of form values
* @param {T} initialValues - Initial form values
* @returns Form handlers and state
*/
export const use${name} = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
      setValues(prev => ({
          ...prev,
          [name]: value
      }));
  }, []);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
      try {
          setIsSubmitting(true);
          await onSubmit(values);
      } catch (err) {
          console.error(err);
      } finally {
          setIsSubmitting(false);
      }
  }, [values]);

  const reset = useCallback(() => {
      setValues(initialValues);
      setErrors({});
  }, [initialValues]);

  return {
      values,
      errors,
      isSubmitting,
      handleChange,
      handleSubmit,
      reset
  };
};`,

  lifecycle: (name) => `/**
* A custom lifecycle hook for ${name}
* @param {function} onMount - Called when component mounts
* @param {function} onUnmount - Called when component unmounts
*/
export const use${name} = (
  onMount?: () => void | (() => void),
  onUnmount?: () => void
) => {
  useEffect(() => {
      const cleanup = onMount?.();
      return () => {
          cleanup?.();
          onUnmount?.();
      };
  }, []);
};`,

  custom: (name) => `/**
* A custom utility hook for ${name}
* Generated: 2025-01-03 23:16:59 UTC
* @template T - The type of data to handle
*/
export const use${name} = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (callback: () => Promise<T>) => {
      try {
          setLoading(true);
          setError(null);
          const result = await callback();
          setData(result);
          return result;
      } catch (err) {
          const error = err instanceof Error ? err : new Error('An error occurred');
          setError(error);
          throw error;
      } finally {
          setLoading(false);
      }
  }, []);

  return {
      data,
      loading,
      error,
      execute
  };
};`
};