import {
  createContext,
  useState,
  useContext,
  useCallback,
  // useReducer,
} from "react";
import axios from "axios";
// import { apiReducer, initialState } from "./Reducer";
// import { toast } from "react-toastify";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [onlineStatus, setOnlineStatus] = useState({ status: "offline" });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token || false);
  // const [state, dispatch] = useReducer(apiReducer, initialState);
  // const [data, setData] = useState({});   //if use the global state for data, so we need multiple functions for api's(fetch,post), and overwrite data over global state
  // setUser({ ...user, userData: res_data.data });  // by using this update data, if post data, then got the reponse and update the data according to it, where are we use

  const storeTokenInLS = (serverToken) => {
    return new Promise((resolve) => {
      localStorage.setItem("token", serverToken);
      setToken(localStorage.getItem("token"));
      setIsLoggedIn(true);
      resolve();
    });
  };

  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    return;
  };

  // Fetch Data (GET Request)
  const fetchData = useCallback(async (url) => {
    setApiLoading(true);
    // dispatch({ type: "SET_LOADING", payload: true });
    try {
      const axiosResponse = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Extract data
      // dispatch({ type: "SET_USER_DATA", payload: axiosResponse?.data?.data });
      return axiosResponse.data;
    } catch (error) {
      const responseData = error?.response?.data;
      // dispatch({ type: "SET_ERROR", payload: responseData });
      return responseData;
    } finally {
      // dispatch({ type: "SET_LOADING", payload: false });
      setApiLoading(false);
    }
  }, []);

  const postData = useCallback(async (endpoint, payload) => {
    setApiLoading(true);
    // dispatch({ type: "SET_LOADING", payload: false });
    try {
      const axiosResponse = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Extract data
      // dispatch({ type: "SET_USER_DATA", payload: axiosResponse?.data?.data });
      return axiosResponse?.data || { success: false, message: "No response data" };
    } catch (error) {
      console.error("API Error:", error);
      const responseData = error?.response?.data;
      // If we have response data from server, return it
      if (responseData) {
        return responseData;
      }
      // Otherwise return a proper error object
      return {
        success: false,
        message: error?.message || "Network error occurred"
      };
      // dispatch({ type: "SET_ERROR", payload: responseData });
    } finally {
      // dispatch({ type: "SET_LOADING", payload: false });
      setApiLoading(false);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        postData,
        fetchData,
        LogoutUser,
        isLoggedIn,
        apiLoading,
        refreshFlag,
        setRefreshFlag,
        storeTokenInLS,
        onlineStatus,
        setOnlineStatus,
        // state,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
