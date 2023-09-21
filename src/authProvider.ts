import { AuthBindings } from "@refinedev/core";
import axios from "axios";
import nookies from "nookies";
import { IUser, ResponseLoginData } from "pages/api/login";
import { axiosInstance } from "./rest-data-provider/utils";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post<ResponseLoginData>("/api/login", {
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
    nookies.destroy(null, "auth");
    nookies.destroy(null, "token");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async (ctx: any) => {
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
