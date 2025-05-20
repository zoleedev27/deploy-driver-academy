import { LogInRequest, LogInResponse } from "@/Interfaces/auth/ILogin";
import { loginUser } from "@/pages/api/auth/login";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation<LogInResponse, Error, LogInRequest>({
    mutationFn: loginUser,
  });
};
