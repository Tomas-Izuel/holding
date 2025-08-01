import { NextRequest } from "next/server";

export async function apiKeyMiddleware(request: NextRequest): Promise<boolean> {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return false;
    }

    // Validar que la API key coincida con la configurada en las variables de entorno
    const validApiKey = process.env.SCRAPING_API_KEY;

    if (!validApiKey || apiKey !== validApiKey) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("[API KEY MIDDLEWARE ERROR]", error);
    return false;
  }
}
