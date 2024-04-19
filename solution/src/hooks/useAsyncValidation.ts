import React, { useEffect, useState } from "react";

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

const INITIAL_VALIDATION_RESULT: ValidationResult = {
  isValid: true,
  message: "",
};
const EXCEPTION_VALIDATION_RESULT: ValidationResult = {
  isValid: false,
  message: "An error occurred while validating. Try again later.",
};

interface StringValidationFunction {
  (input: string): Promise<ValidationResult>;
}

interface HookResult extends ValidationResult {
  value: string;
  pending: boolean;
  initValue: (newValue: string) => void;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

// This hook is used to validate a string asynchronously given the initial value and an async validation function.
// It returns the current value, the validation result, a pending flag, and a change handler.
// This hook is not strictly necessary for the current requirements, but it is a good practice to separate concerns and
// provides a way to tie into async validation functions for any text/string field.
const useAsyncStringValidation = (
  initialValue: string,
  validateAsync: StringValidationFunction
): HookResult => {
  const [value, setValue] = useState(initialValue);
  const [result, setResult] = useState(INITIAL_VALIDATION_RESULT);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      setPending(true);
      try {
        const validationResult = await validateAsync(value);
        if (isMounted) {
          setResult(validationResult);
        }
      } catch (error) {
        if (isMounted) {
          // TODO: Log the error so the dev or technical team can diagnose and better handle in the future.
          // Don't give the user the actual error message.
          // There is no need to confuse or scare them with cyptic, techinical inoformation the cannot do anything about.
          // Any type of error that the user can do something about should be handled in the API.
          setResult(EXCEPTION_VALIDATION_RESULT);
        }
      } finally {
        if (isMounted) {
          setPending(false);
        }
      }
    };

    validate();

    return () => {
      isMounted = false;
    };
  }, [value, validateAsync]);

  const initValue = (newValue: string) => {
    setValue(newValue);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // It is possible that in a real world scenario, the input would need to be debouneced or throttled to prevent excessive long running API calls.
    // Instead, just validate when the user stops typing for a certain amount of time or some other trigger.
    setValue(e.target.value);
  };

  return {
    value,
    ...result,
    pending,
    initValue, //This is provided to allow the parent component to set the value from outside the hook.
    handleChange,
  };
};

export { useAsyncStringValidation };
