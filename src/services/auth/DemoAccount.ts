import { AuthError, type AuthService } from './AuthService'

export const DEMO_ACCOUNT = {
  name: 'Demo Visitor',
  email: 'demo@vei.app',
  password: 'VeiDemo2026',
} as const

/** Signs in the shared demo user, creating it the first time. Only meant for the demo build. */
export async function signInAsDemo(auth: AuthService): Promise<void> {
  try {
    await auth.signIn({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })
  } catch (error) {
    if (!(error instanceof AuthError) || error.code !== 'invalid_credentials') throw error
    await auth.signUp({ ...DEMO_ACCOUNT })
  }
}
