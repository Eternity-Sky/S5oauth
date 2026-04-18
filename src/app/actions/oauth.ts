"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function createOAuthClient(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const redirectUri = formData.get("redirectUri") as string;

  if (!name || !redirectUri) throw new Error("Name and Redirect URI are required");

  await prisma.oAuthClient.create({
    data: {
      name,
      clientId: nanoid(16),
      clientSecret: nanoid(32),
      redirectUris: [redirectUri],
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteOAuthClient(clientId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.oAuthClient.delete({
    where: { clientId },
  });

  revalidatePath("/dashboard");
}
