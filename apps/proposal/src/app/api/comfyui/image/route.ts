/**
 * ComfyUI 이미지 프록시 API
 * GET /api/comfyui/image?filename=xxx&subfolder=xxx&type=output
 */

import { NextRequest, NextResponse } from "next/server";
import { comfyUIClient } from "@/lib/comfyui";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get("filename");
    const subfolder = searchParams.get("subfolder") || "";
    const type = (searchParams.get("type") as "output" | "input" | "temp") || "output";

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // ComfyUI에서 이미지 가져오기
    const imageBuffer = await comfyUIClient.getImage(filename, subfolder, type);

    // Content-Type 추론
    const extension = filename.split(".").pop()?.toLowerCase();
    const contentType = extension === "png" ? "image/png"
      : extension === "jpg" || extension === "jpeg" ? "image/jpeg"
      : extension === "webp" ? "image/webp"
      : "image/png";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });

  } catch (error) {
    console.error("ComfyUI image error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    const isConnectionError = message.includes("ECONNREFUSED") || message.includes("fetch failed");

    return NextResponse.json(
      {
        error: isConnectionError
          ? "ComfyUI 서버에 연결할 수 없습니다."
          : message
      },
      { status: isConnectionError ? 503 : 500 }
    );
  }
}
