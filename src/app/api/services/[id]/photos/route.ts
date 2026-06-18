import { NextResponse } from "next/server";
import { errorResponse } from "@/mock/helpers";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof Blob)) {
    return errorResponse("Arquivo de foto não enviado.", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "image/jpeg";
  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

  return NextResponse.json({ url: dataUrl }, { status: 201 });
}
