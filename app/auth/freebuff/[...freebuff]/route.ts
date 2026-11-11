import { getFreebuff } from "@/lib/freebuff-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const freebuff = await getFreebuff();
  return freebuff.handlers.GET(request);
}

export async function POST(request: Request) {
  const freebuff = await getFreebuff();
  return freebuff.handlers.POST(request);
}
