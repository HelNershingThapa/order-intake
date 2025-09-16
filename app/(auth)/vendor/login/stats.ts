import { z } from "zod";

export type State = {
  zodErrors: Record<string, string[]> | null; // field -> messages
  backend_error: string | null;
  data: { name: string; apikey: string };
  message: string | null;
};

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  apikey: z.string().min(1, "API key is required"),
});
