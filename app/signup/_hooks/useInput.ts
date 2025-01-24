"use client";

import { useState } from "react";

const useInput = (
  initialValue: string,
  validate?: (value: string, additionalValue?: string) => string | null
) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    additionalValue?: string
  ) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (validate) {
      const validationError = validate(newValue, additionalValue);
      setError(validationError);
    }
  };

  return { value, error, onChange: handleChange };
};

export default useInput;
