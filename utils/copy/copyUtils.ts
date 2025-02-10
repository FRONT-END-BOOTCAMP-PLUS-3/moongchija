export const copyToClipboard = (
  text: string,
  setCopiedState: (value: boolean) => void,
  errorMessage: string
) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedState(true);
          setTimeout(() => setCopiedState(false), 2000);
        })
        .catch(() => {
          fallbackCopy(text, setCopiedState, errorMessage);
        });
    } else {
      fallbackCopy(text, setCopiedState, errorMessage);
    }
  } catch {
    alert(errorMessage);
  }
};

// ✅ `execCommand("copy")` 방식 (모바일 지원)
export const fallbackCopy = (
  text: string,
  setCopiedState: (value: boolean) => void,
  errorMessage: string
) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } else {
      alert(errorMessage);
    }
  } catch {
    alert(errorMessage);
  }

  document.body.removeChild(textArea);
};
