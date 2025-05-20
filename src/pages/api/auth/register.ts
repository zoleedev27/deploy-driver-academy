import { RegisterRequest, RegisterResponse } from "@/Interfaces/auth/IRegister";
import { apiClient } from "@/lib/apiClient";

export const registerUser = async (data : RegisterRequest) => {
    return apiClient<RegisterResponse>("register", "POST", data);
}
