"use client";

import { useState } from "react";

const useInput = (
  initialValue: string,
  validate?: (value: string, additionalValue?: string) => string | null
) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    emailOrEvent: string | React.ChangeEvent<HTMLInputElement>,
    additionalValue?: string
  ) => {
    const newValue =
      typeof emailOrEvent === "string"
        ? emailOrEvent
        : emailOrEvent.target.value;

    setValue(newValue);

    if (validate) {
      const validationError = validate(newValue, additionalValue);
      setError(validationError);
    }
  };

  return { value, error, onChange: handleChange, setValue };
};

export default useInput;
