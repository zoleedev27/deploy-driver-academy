import { API_URL, TOKEN_NAME } from "@/constants/general";
import { deleteCookie, getCookie } from "cookies-next";

export const apiClient = async <T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: object,
    locale: string = "en",
  ): Promise<T> => {
    const token = getCookie(TOKEN_NAME); 
  
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": locale || "en",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        if (res.status === 401) {
            deleteCookie(TOKEN_NAME);
        }
        throw new Error(data.message || data.error || "Something went wrong");
    }    
    return data;
    
}
  