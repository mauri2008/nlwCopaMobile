import { useContext } from "react";

import { AuthContext, AuthContextProps } from "../context/AuthContext";

export function useAuth(): AuthContextProps {
    const context = useContext(AuthContext);


    return context
}