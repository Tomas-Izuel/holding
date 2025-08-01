import { NextRequest, NextResponse } from "next/server";
import { apiKeyMiddleware } from "@/server/middlewares/api-key.middleware";
import { getAllGroupsForScraping } from "@/server/services/group.service";

export async function GET(request: NextRequest) {
  try {
    // Validar API key
    const isValidApiKey = await apiKeyMiddleware(request);

    if (!isValidApiKey) {
      return NextResponse.json(
        { error: "API key inválida o no proporcionada" },
        { status: 401 }
      );
    }

    // Obtener todos los grupos con sus holdings
    const groups = await getAllGroupsForScraping();

    return NextResponse.json({
      success: true,
      data: groups,
      total: groups.length,
    });
  } catch (error) {
    console.error("[SCRAPING GROUPS API ERROR]", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          success: false,
        },
        { status: error.cause === 500 ? 500 : 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        success: false,
      },
      { status: 500 }
    );
  }
}
