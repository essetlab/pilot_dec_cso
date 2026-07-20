import "dotenv/config";
import { defineConfig } from "prisma/config";

function getMigrationUrl() {
  if (process.env.DIRECT_URL) {
    return process.env.DIRECT_URL;
  }

  const runtimeUrl = process.env.DATABASE_URL;

  if (!runtimeUrl) {
    return undefined;
  }

  try {
    const { hostname } = new URL(runtimeUrl);

    if (["localhost", "127.0.0.1", "::1"].includes(hostname)) {
      return runtimeUrl;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations-postgres",
  },
  datasource: {
    url: getMigrationUrl(),
  },
});
