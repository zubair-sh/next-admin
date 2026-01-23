import { useSettings } from "@/providers/settings-provider";
import { en } from "@/dictionaries/en";
import { ar } from "@/dictionaries/ar";

const dictionaries = {
  en,
  ar,
};

export const useTranslation = () => {
  const { language } = useSettings();
  const dictionary = dictionaries[language] || dictionaries.en;

  // Simple interpolation helper
  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = dictionary;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return key; // Fallback to key if not found
      }
    }

    if (typeof value !== "string") return key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return value;
  };

  return { t, dictionary, language };
};
