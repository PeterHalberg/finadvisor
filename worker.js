import { WebWorkerMLCEngineHandler } from "https://esm.sh/@mlc-ai/web-llm";

// Обработчик сообщений, который связывает UI и модель
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg) => {
  handler.onmessage(msg);
}
