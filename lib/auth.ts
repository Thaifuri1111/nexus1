import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nexus-secret')
const ALG = 'HS256'
const EXPIRATION = '7d'

export async function generateToken(userId: string, isAdmin: boolean = false) {
  const token = await new SignJWT({ userId, isAdmin })
    .setProtectedHeader({ alg: ALG })
    .setExpirationTime(EXPIRATION)
    .sign(SECRET)
  return token
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, SECRET)
    return verified.payload as { userId: string; isAdmin: boolean }
  } catch (error) {
    return null
  }
}