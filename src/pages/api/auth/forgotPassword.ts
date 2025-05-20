import { ForgotPasswordRequest } from "@/interfaces/auth/IForgotPassword";
import { apiClient } from "@/lib/apiClient";

export const forgotPasswordUser = async (data: ForgotPasswordRequest) => {
  const res = await apiClient<void>("forgot-password", "POST", data);
  return res;
};
