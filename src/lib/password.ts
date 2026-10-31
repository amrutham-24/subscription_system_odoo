import bcrypt from "bcryptjs";

export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length <= 8) {
    return { isValid: false, message: "Password must be more than 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must include at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must include at least one lowercase letter." };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { isValid: false, message: "Password must include at least one special character (e.g. !@#$%^&*)." };
  }
  return { isValid: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
