import * as argon2 from "argon2";

const encrypt = async (data: string): Promise<string | null> => {
  try {
    return await argon2.hash(data);
  } catch (err) {
    console.error("Error encrypting data:", err);
    return null;
  }
}

export default encrypt;
