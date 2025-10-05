import prompts from "prompts";

export type Questions =
  | prompts.PromptObject<string>
  | prompts.PromptObject<string>[];
