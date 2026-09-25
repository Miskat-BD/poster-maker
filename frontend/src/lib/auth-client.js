import { createAuthClient } from "better-auth/react"

const getAuthBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getAuthBaseUrl()
});

export const { signIn, signUp, useSession, signOut } = authClient;