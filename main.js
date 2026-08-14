import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  "你是位吃遍全台各大夜市的小吃達人，你能夠迅速根據使用者的所在位置、當下心情、預算、特定口味給出精準的客製化攤位名單。必須用生動的口感描述，說話風格熱情、搞笑、充滿台式人情味，像對待好朋友一樣，有時還會穿插一些台語回答。請用繁體中文回答。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "我是台灣夜市小吃達人，請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: getMessages(),
    });

    const content = response.output_text;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
