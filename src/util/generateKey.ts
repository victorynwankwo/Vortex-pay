import { randomBytes } from "node:crypto";

export function generatePublicKey(): string {
  return `pk_test_${randomBytes(24).toString("hex")}`;
}

export function generateSecretKey(): string {
  return `sk_test_${randomBytes(24).toString("hex")}`;
}