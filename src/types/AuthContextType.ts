import { ForgotPasswordRequest } from "@/Interfaces/auth/IForgotPassword";
import { LogInRequest, LogInResponse } from "@/Interfaces/auth/ILogin";
import { RegisterRequest, RegisterResponse } from "@/Interfaces/auth/IRegister";
import { IResetPasswordRequest } from "@/Interfaces/auth/IResetPassword";

export type AuthContextType = {
    isLogged : boolean
    register: (data: RegisterRequest) => Promise<RegisterResponse>;
    login : (data : LogInRequest) => Promise<LogInResponse>;
    logout : () => void;
    forgotPassword : (data : ForgotPasswordRequest) => Promise<void>;
    resetPassword : (data : IResetPasswordRequest) => Promise<void>;
};