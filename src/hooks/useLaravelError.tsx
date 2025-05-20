import { useTranslation } from "next-i18next";
import { LARAVEL_ERRORS } from "@/constants/general";

export const useLaravelError = () => {
  const { t } = useTranslation("auth");

  return (message: string): string => {
    const key = LARAVEL_ERRORS[message];

    if (key) {
      const translated = t(key);
      return translated;
    }
    return message;
  };
};
