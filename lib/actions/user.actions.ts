'use server';

import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { parseStringify } from "../utils";

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData;

  try {
    const { account, database } = await createAdminClient();

    // Create auth user
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    // Set cookie for login
    const cookieStore = await cookies();
    cookieStore.set({
      name: "appwrite-session",
      value: session.secret,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
    });

    // Store user in DB
    const newUser = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
      }
    );

    return parseStringify(newUser);
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "appwrite-session",
      value: session.secret,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
    });

    return "SUCCESS";
  } catch (error) {
    console.error("SignIn Error:", error);
    throw error;
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    const cookieStore = await cookies();
    cookieStore.delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};
