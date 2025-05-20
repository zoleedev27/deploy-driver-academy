import { TOKEN_NAME } from "@/constants/general";
import { AuthContext } from "@/contexts/AuthContext";
import { useLogin } from "@/hooks/useLogIn";
import { useRegister } from "@/hooks/useRegister";
import { LogInRequest, LogInResponse } from "@/Interfaces/auth/ILogin";
import { RegisterRequest, RegisterResponse } from "@/Interfaces/auth/IRegister";
import { deleteCookie, getCookie } from "cookies-next";
import router from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
import { useLaravelError } from "@/hooks/useLaravelError";
import { ForgotPasswordRequest } from "@/Interfaces/auth/IForgotPassword";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { useResetPassword } from "@/hooks/useReset";
import { IResetPasswordRequest } from "@/Interfaces/auth/IResetPassword";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const [isLogged, setIsLogged] = React.useState(false);
  const { t } = useTranslation("auth");
  const translateError = useLaravelError();

  React.useEffect(() => {
    setIsLogged(!!getCookie(TOKEN_NAME));
  }, []);

  const register = (data: RegisterRequest): Promise<RegisterResponse> => {
    return new Promise((resolve, reject) => {
      registerMutation.mutate(data, {
        onSuccess: (res) => {
          toast.success(t("rest.register.success"));
          resolve(res);
        },
        onError: (err) => {
          const translated = translateError(err.message);
          toast.error(translated);
          reject(err);
        },
      });
    });
  };

  const login = (data: LogInRequest): Promise<LogInResponse> => {
    return new Promise((resolve, reject) => {
      loginMutation.mutate(data, {
        onSuccess: (res) => {
          toast.success(t("rest.login.success"));
          setIsLogged(!!getCookie(TOKEN_NAME));
          resolve(res);
        },
        onError: (err) => {
          const translated = translateError(err.message);
          toast.error(translated);
          reject(err);
        },
      });
    });
  };

  const logout = () => {
    deleteCookie(TOKEN_NAME);
    setIsLogged(false);
    toast.success(t("rest.logout.success"));
    router.push("/");
  };

  const forgotPassword = (data: ForgotPasswordRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      forgotPasswordMutation.mutate(data, {
        onSuccess: (res) => {
          toast.success(t("rest.forgot.password.success"));
          resolve(res);
        },
        onError: (err) => {
          const translated = translateError(err.message);
          toast.error(translated);
          reject(err);
        },
      });
    });
  };

  const resetPassword = (data: IResetPasswordRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      resetPasswordMutation.mutate(data, {
        onSuccess: (res) => {
          toast.success(t("rest.reset.password.success"));
          resolve(res);
        },
        onError: (err) => {
          const translated = translateError(err.message);
          toast.error(translated);
          reject(err);
        },
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
