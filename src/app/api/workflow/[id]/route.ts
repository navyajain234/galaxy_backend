import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, nodes, edges } = body;

    const workflow = await prisma.workflow.update({
      where: { id, userId },
      data: {
        name,
        nodes: nodes ?? [],
        edges: edges ?? [],
      },
    });

    return NextResponse.json(workflow);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
