const characterPool =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const characterPoolLength = characterPool.length;

export function randomString(length: number) {
  let result = "";
  let counter = 0;
  while (counter < length) {
    result += characterPool.charAt(
      Math.floor(Math.random() * characterPoolLength)
    );
    counter += 1;
  }
  return result;
}
