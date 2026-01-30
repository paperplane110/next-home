import { createAuthServer } from '@neondatabase/auth/next/server';
export const authServer = createAuthServer();

export async function protect() {
    const auth = await authServer.getSession();
    if (!auth) {
      throw new Error("Unauthorized")
    }
    return auth;
}