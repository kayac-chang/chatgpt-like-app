import z from "zod";

export default z
  .object({
    DATABASE_URL: z.string(),
    SESSION_SECRET: z.string(),
  })
  .parse(process.env);
