import { unlinkSync, existsSync } from "node:fs";

// Remove lock files from other package managers (cross-platform)
for (const f of ["package-lock.json", "yarn.lock"]) {
  if (existsSync(f)) {
    try { unlinkSync(f); } catch {}
  }
}

// Enforce pnpm usage
const ua = process.env.npm_config_user_agent || "";
if (!ua.startsWith("pnpm")) {
  process.stderr.write("Hata: Bu proje pnpm kullanmak zorundadır.\nKurulum: npm install -g pnpm\n");
  process.exit(1);
}
