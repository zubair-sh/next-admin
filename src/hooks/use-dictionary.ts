import { useMessages } from "next-intl";

export const useDictionary = () => {
  const messages = useMessages();
  return messages;
};
