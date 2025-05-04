import { METADATA_TOKEN } from "@/types/common";
import { cookies } from "next/headers";

export async function getMetadata() {
  const cookieStore = await cookies();
  const metadata = cookieStore.get(METADATA_TOKEN);
  return JSON.parse(metadata?.value || "{}");
}
