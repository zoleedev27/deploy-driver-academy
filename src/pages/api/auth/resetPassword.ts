import { IResetPasswordRequest } from "@/Interfaces/auth/IResetPassword";
import { apiClient } from "@/lib/apiClient";

export const resetPasswordUser = async (data : IResetPasswordRequest) => {
    const res = await apiClient<void>("reset-password", "POST", data);
    return res;
}