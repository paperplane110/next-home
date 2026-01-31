import { createAuthServer } from '@neondatabase/auth/next/server';
export const authServer = createAuthServer();

export async function protectAdmin() {
    const auth = await authServer.getSession();
    if (auth?.data?.user.role !== "admin") {
      throw new Error("Unauthorized")
    }
    return auth;
}