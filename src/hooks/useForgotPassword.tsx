import { ForgotPasswordRequest } from "@/interfaces/auth/IForgotPassword";
import { forgotPasswordUser } from "@/pages/api/auth/forgotPassword";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  return useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: forgotPasswordUser,
  });
};
