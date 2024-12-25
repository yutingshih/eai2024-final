export type OpenAIModel = "Llama-3.1-8B-Instruct-Atom" | "Llama-3.1-8B-Instruct-SmoothQuant";

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}
