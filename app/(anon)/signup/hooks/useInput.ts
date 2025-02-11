"use client";

import { useEffect, useState } from "react";

const useInput = (
  initialValue: string,
  validate?: (passwordCheck: string, password?: string) => string | null,
  comparisonValue?: string
) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const handleChange = (
    emailOrEvent: string | React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue =
      typeof emailOrEvent === "string"
        ? emailOrEvent
        : emailOrEvent.target.value;

    setValue(newValue);

    if (!isTouched) {
      setIsTouched(true);
    }
  };

  useEffect(() => {
    if (isTouched && validate) {
      const validationError = validate(value, comparisonValue);
      setError(validationError);
    }
  }, [value, comparisonValue, validate, isTouched]);
  return {
    value,
    error: isTouched ? error : null,
    onChange: handleChange,
    setValue,
  };
};

export default useInput;
