import dotenv from "dotenv"
dotenv.config();

export const API_V = "v1";

export const googleClientId = process.env.GOOGLE_CLIENT_ID
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
export const googleRedirectUrl = process.env.GOOGLE_REDIRECT_URL
