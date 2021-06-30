import bcrypt from "bcrypt";

export class Password {
  static async toHash(password: string): Promise<string> {
    const saltRounds: number = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(storedPassword, suppliedPassword);
  }
}
