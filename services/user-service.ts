import { getUser } from "./auth-service";

export const getCurrentUserProfile = async () => {
  const user = await getUser();
  return user;
};
