import { RegisterRequest, RegisterResponse } from "@/Interfaces/auth/IRegister";
import { registerUser } from "@/pages/api/auth/register";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: registerUser,
  });
};
