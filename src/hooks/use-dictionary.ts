import { useMessages } from "next-intl";
import en from "@/messages/en.json";

export const useDictionary = () => {
  const messages = useMessages();
  return messages as typeof en;
};
