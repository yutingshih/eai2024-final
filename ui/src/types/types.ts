export type OpenAIModel = "Llama-2-7B" | "Llama-3.1-8B";

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}
