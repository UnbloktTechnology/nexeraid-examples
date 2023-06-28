import { type IUser } from "@/features/Interfaces";
import { createContext, type ReactNode, useEffect, useState } from "react";

interface ISimpleAuthContext {
  isLogin: boolean;
  signIn: (user: IUser) => boolean;
  signOut: (id: string) => boolean;
  getUser: () => IUser | undefined;
  authenticated: boolean;
  authenticate: () => void;
}

export const SimpleAuthContext = createContext<ISimpleAuthContext>({
  isLogin: false,
  signIn: () => false,
  signOut: () => false,
  getUser: () => undefined,
  authenticated: false,
  authenticate: () => undefined,
});

// Only for demo purposes
export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setIsLogin(!!localStorage.getItem("example-user"));
  }, []);

  const signIn = (user: IUser) => {
    localStorage.setItem("example-user", JSON.stringify(user));
    setIsLogin(true);
    return true;
  };

  const signOut = (id: string) => {
    const currentUser = localStorage.getItem("example-user");

    if (currentUser) {
      const user = JSON.parse(currentUser) as IUser;

      if (user.id === id) {
        localStorage.removeItem("example-user");
        setIsLogin(false);

        return true;
      }
    }
    return false;
  };

  const getUser = () => {
    const currentUser = localStorage.getItem("example-user");

    if (currentUser) {
      return JSON.parse(currentUser) as IUser;
    }
  };

  const authenticate = () => {
    setAuthenticated(true);
  };

  return (
    <SimpleAuthContext.Provider
      value={{ isLogin, signIn, signOut, getUser, authenticate, authenticated }}
    >
      {children}
    </SimpleAuthContext.Provider>
  );
};
