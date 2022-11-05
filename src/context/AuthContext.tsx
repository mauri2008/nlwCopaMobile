import { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { api } from '../services/api'

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string
}

export interface AuthContextProps {
    user: UserProps;
    iseUserloading: boolean;
    signin: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: AuthProviderProps) {

    const [iseUserloading, setIsUserLoading] = useState(false)
    const [user, setUser] = useState<UserProps>({} as UserProps)

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    })

    async function signin() {
        try {
            setIsUserLoading(true)
            await promptAsync();


        } catch (error) {
            console.log(error)
            throw error
        }
        finally {
            setIsUserLoading(false)
        }
    }

    async function signInWithGoogle(access_token: string) {
        try {
            setIsUserLoading(true)
            const tokenResponse = await api.post('/users', { access_token })
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

            const userInfoResponse = await api.get('/me');
            setUser(userInfoResponse.data.user)

        } catch (error) {
            console.log(error)
            throw error;
        }
        finally {
            setIsUserLoading(false)
        }
    }

    useEffect(() => {
        if (response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken)
        }
    }, [response])

    return (
        <AuthContext.Provider value={{
            signin,
            user,
            iseUserloading,

        }}>
            {children}
        </AuthContext.Provider>
    )
}