import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import apiFetch from "../utils/axios";
import Loader from "../components/Loader";

const AuthContext = createContext<{
  user: any;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}>({
  user: undefined,
  isLoading: true,
  setUser: () => {},
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  const getSession = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/session")
      .then((res) => {
        setUser(res.data.user);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    getSession();
  }, [getSession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContextProvider;
