"use client";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().min(2).max(50),
  password: z.string().min(6).max(50),
});

export default formSchema;
