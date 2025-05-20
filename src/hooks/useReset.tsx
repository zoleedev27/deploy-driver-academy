import { IResetPasswordRequest } from "@/interfaces/auth/IResetPassword";
import { resetPasswordUser } from "@/pages/api/auth/resetPassword";
import { useMutation } from "@tanstack/react-query";

export const useResetPassword = () => {
  return useMutation<void, Error, IResetPasswordRequest>({
    mutationFn: resetPasswordUser,
  });
};
