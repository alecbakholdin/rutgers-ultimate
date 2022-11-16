import cookies from "js-cookie";
import { User } from "types/user";

export const getUserFromCookie = (): User | null => {
  const cookie = cookies.get("auth");
  if (!cookie) {
    return null;
  }
  return JSON.parse(cookie) as User;
};

export const setUserCookie = (user: User) => {
  cookies.set("auth", JSON.stringify(user), {
    expires: 1 / 24,
  });
};

export const removeUserCookie = () => cookies.remove("auth");
