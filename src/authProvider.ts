import { AuthBindings } from "@refinedev/core";
import axios from "axios";
import nookies from "nookies";
import { ResponseLoginData } from "pages/api/login";
import { axiosInstance } from "./rest-data-provider/utils";
import { GetServerSidePropsContext } from "next";
import { IUser } from "./interfaces/user";

/**
 * Authentication provider object that implements the AuthBindings interface.
 * Provides methods for login, logout, checking authentication status, getting permissions, and getting user identity.
 * @typedef {Object} AuthProvider
 * @property {Function} login - Method for logging in a user with email and password.
 * @property {Function} logout - Method for logging out a user.
 * @property {Function} check - Method for checking if a user is authenticated.
 * @property {Function} getPermissions - Method for getting the permissions of an authenticated user.
 * @property {Function} getIdentity - Method for getting the identity of an authenticated user.
 * @property {Function} onError - Method for handling errors that occur during authentication.
 */
export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post<ResponseLoginData>("/api/login", {
        email,
        password,
      });
      const token = response.data.token.token;
      const user = response.data.user[0];

      if (user && token) {
        nookies.set(null, "auth", JSON.stringify(user), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        nookies.set(null, "token", token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };

        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: {
          name: "Login Error",
          message: "Invalid credentials",
        },
      };
    } catch (error) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else {
        const err = error as Error;
        message = err.message || message;
      }

      return {
        success: false,
        error: {
          name: "Login Error",
          message,
        },
      };
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.delete("/api/logout");

      if (response.status === 200) {
        nookies.destroy(null, "auth");
        nookies.destroy(null, "token");
        return {
          success: true,
          redirectTo: "/login",
        };
      } else {
        return {
          success: false,
          error: {
            name: "Logout Error",
            message: "Something went wrong",
          },
        };
      }
    } catch (error) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else {
        const err = error as Error;
        message = err.message || message;
      }

      return {
        success: false,
        error: {
          name: "Logout Error",
          message,
        },
      };
    }
  },
  check: async (ctx: GetServerSidePropsContext) => {
    const cookies = nookies.get(ctx);
    if (cookies.auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = nookies.get().auth;
    if (auth) {
      const parsedUser: IUser = JSON.parse(auth);
      return parsedUser.role_id;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = nookies.get().auth;
    if (auth) {
      const parsedUser: IUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
