"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

// ------- SESSION CLIENT (for logged-in user) -------
export async function createSessionClient() {
  const cookieStore = await cookies(); // ⬅️ await compulsory
  const session = cookieStore.get("appwrite-session");

  if (!session?.value) {
    throw new Error("No session");
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// ------- ADMIN CLIENT (server side, root key access) -------
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
