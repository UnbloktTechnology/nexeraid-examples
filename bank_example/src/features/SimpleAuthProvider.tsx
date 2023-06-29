import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type TestUser } from "@/appConfig";

interface ISimpleAuthContext {
  isLogin: boolean;
  signIn: (user: TestUser) => boolean;
  signOut: (id: string) => boolean;
  getUser: () => TestUser | undefined;
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

  const signIn = (user: TestUser) => {
    localStorage.setItem("example-user", JSON.stringify(user));
    setIsLogin(true);
    return true;
  };

  const signOut = (id: string) => {
    const currentUser = localStorage.getItem("example-user");

    if (currentUser) {
      const user = JSON.parse(currentUser) as TestUser;

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
      return JSON.parse(currentUser) as TestUser;
    }
  };

  const authenticate = () => {
    setAuthenticated(true);
  };

  const value = useMemo(() => {
    return {
      isLogin,
      signIn,
      signOut,
      getUser,
      authenticated,
      authenticate,
    };
  }, [isLogin, authenticated]);

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
