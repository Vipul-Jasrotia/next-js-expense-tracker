import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "./db"; // ✅ fixed import

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const db = getDb(); // ✅ initialize database safely

  // ✅ Find the user by Clerk ID
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (loggedInUser) {
    return loggedInUser;
  }

  // ✅ Create a new user in MySQL if not found
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress || "",
    },
  });

  return newUser;
};
