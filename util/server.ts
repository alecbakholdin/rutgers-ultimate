import { DecodedIdToken } from "firebase-admin/lib/auth";
import { serverAuth, serverDb } from "config/firebaseServerApp";
import { UserData } from "types/userData";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";

export async function getDecodedToken(
  authToken: string | undefined
): Promise<DecodedIdToken | undefined> {
  if (!authToken) return undefined;
  return await serverAuth.verifyIdToken(authToken).catch((e) => {
    console.error(e);
    return undefined;
  });
}

export async function getUserData(
  authToken: string | undefined
): Promise<UserData | undefined> {
  const user = await getDecodedToken(authToken);
  console.log(authToken, user);
  if (!user) return undefined;
  const userDataDoc = serverDb
    .collection("userData")
    .withConverter(getServerFirestoreConverter<UserData>())
    .doc(user.uid);
  return (await userDataDoc.get()).data();
}
