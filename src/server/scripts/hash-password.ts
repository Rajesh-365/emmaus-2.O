/**
 * Interactive utility — hash a password for the admin login.
 *
 * Usage:
 *   npm run admin:hash-password -- <your-password>
 *
 * Copy the output into .env.local as ADMIN_PASSWORD_HASH.
 * Never commit the hash or the plaintext.
 */

import bcrypt from "bcryptjs";

async function main() {
  const pw = process.argv[2];
  if (!pw) {
    console.error("Usage: npm run admin:hash-password -- <password>");
    process.exit(1);
  }
  if (pw.length < 12) {
    console.error("Refusing to hash — password must be at least 12 characters.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(pw, 12);
  // Next.js's env loader interprets `$` as variable expansion, which would
  // mangle the bcrypt hash. Escape each `$` with `\$` in the output so the
  // value survives the paste.
  const escaped = hash.replace(/\$/g, "\\$");
  console.log(`\nADMIN_PASSWORD_HASH="${escaped}"`);
  console.log("\nCopy the line above into .env.local (paste the quotes too).");
}

main();
