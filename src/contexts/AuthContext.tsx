import { AuthContextType } from "@/types/AuthContextType";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
