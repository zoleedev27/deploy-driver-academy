import { TOKEN_NAME } from "@/constants/general";
import { LogInRequest, LogInResponse } from "@/Interfaces/auth/ILogin";
import { apiClient } from "@/lib/apiClient";
import { setCookie } from "cookies-next";

export const loginUser = async (data : LogInRequest) : Promise<LogInResponse> => {
    const res = await apiClient<LogInResponse>("login", "POST", data);
    setCookie(TOKEN_NAME, res.token, {
        maxAge: 60 * 60 * 7 * 24,
        path: "/"
    });
    return res;
}