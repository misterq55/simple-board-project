export function makeId(length: number): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function slugify(str: string): string {
  return str
    .toString()
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]+/g, "")
    .replace(/\-\-+/g, "-");
}

