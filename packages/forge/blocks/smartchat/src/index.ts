import { createBlock } from "@typebot.io/forge";
import { sendPrompt } from "./actions/sendPrompt";
import { auth } from "./auth";
import { SmartChatLogo } from "./logo";

export const smartchatBlock = createBlock({
  id: "smartchat" as const,
  name: "SmartChat",
  fullName: "SmartChat (OpenAI Responses API)",
  tags: ["openai", "ai", "chat", "smartchat"],
  LightLogo: SmartChatLogo,
  auth,
  actions: [sendPrompt],
});
