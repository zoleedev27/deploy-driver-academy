import { ForgotPasswordRequest } from "@/interfaces/auth/IForgotPassword";
import { LogInRequest, LogInResponse } from "@/interfaces/auth/ILogin";
import { RegisterRequest, RegisterResponse } from "@/interfaces/auth/IRegister";
import { IResetPasswordRequest } from "@/interfaces/auth/IResetPassword";

export type AuthContextType = {
  isLogged: boolean;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  login: (data: LogInRequest) => Promise<LogInResponse>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: IResetPasswordRequest) => Promise<void>;
};
