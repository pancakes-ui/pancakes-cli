import { Choice } from "prompts";

export const createOption = (name: string): Choice => ({
  title: name,
  value: name,
});
