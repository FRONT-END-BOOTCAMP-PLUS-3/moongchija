import { useState } from "react";
import useInput from "../../signup/hooks/useInput";
import { useRouter } from "next/navigation";

const useLogin = () => {
  const { value: email, onChange: handleChangeEmail } = useInput("");
  const {
    value: password,
    setValue: setPassword,
    onChange: handleChangePassword,
  } = useInput("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: email, password: password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setErrorMessage(error);
        setPassword("");
        setIsLoading(false);
        return;
      }

      const { redirectUrl } = await response.json();
      const redirectPath = localStorage.getItem("redirectPath");

      if (redirectPath) {
        router.push(redirectPath);
        localStorage.removeItem("redirectPath");
      } else {
        router.push(redirectUrl);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    handleChangeEmail,
    handleChangePassword,
    errorMessage,
    isLoading,
    handleSubmit,
  };
};

export default useLogin;
