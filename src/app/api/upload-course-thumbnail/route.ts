import { NextResponse } from "next/server";
import { prepareUpload, writeUpload } from "@/lib/upload-security";

export async function POST(req: Request) {
  const formData = await req.formData();
  const upload = await prepareUpload(formData, "course-thumbnail");

  if (!upload.success) {
    return NextResponse.json({ error: upload.error }, { status: upload.status });
  }

  await writeUpload(upload.file, upload.relativePath);

  return NextResponse.json({ url: upload.relativePath });
}
