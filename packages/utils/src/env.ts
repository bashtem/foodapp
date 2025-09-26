import { z } from "zod";
export const AppEnv = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default("foodapp"),
  DB_PASS: z.string().default("foodapp"),
  DB_NAME: z.string().default("foodapp"),
  NATS_URL: z.string().default("nats://localhost:4222")
});
export type AppEnvType = z.infer<typeof AppEnv>;
export const loadEnv = () => AppEnv.parse(process.env);
