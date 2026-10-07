import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const myCache = new NodeCache({ stdTTL: 60 * 60 * 24 }); //standard time to leave -> 24 hours

export async function generateText(userMessage, threadID) {
  const baseMessages = [
    {
      role: "system",
      content: `You are smart personal assistant, who answers questions asked by the user. You have the access to following tool : 
        1) WebSearch()`,
    },
    // {
    //   role: "user",
    //   content: "What is current weather of Gurugram?",
    // },
  ];

  const messages = myCache.get(threadID) ?? baseMessages;

  //for user queries
  messages.push({
    role: "user",
    content: userMessage,
  });

  while (true) {
    //for LLM tools
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0,
      messages: messages,
      tools: [
        {
          //SCHEMA OBJECT
          type: "function",
          function: {
            name: "webSearch",
            description: "Search the latest and relevant data on the internet.",
            parameters: {
              // JSON Schema object
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The Search Query to perform search on.",
                },
                // unit: {
                //   type: "string",
                //   enum: ["celsius", "fahrenheit"],
                // },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls;
    if (!toolCalls) {
      myCache.set(threadID, messages);
      return completion.choices[0].message.content; //FINAL OUTPUT
      //   console.log(`Assistant : ${completion.choices[0].message.content}`);
      break;
    }

    for (const tools of toolCalls) {
      // console.log(`tool :`, tools);
      const functionName = tools.function.name;
      const functionArguments = tools.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionArguments));
        // console.log(toolResult);

        messages.push({
          tool_call_id: tools.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }

    // console.log(JSON.stringify(completion.choices[0].message, null, 2));
  }
}

async function webSearch({ query }) {
  //Tavily API Call here:
  const response = await tvly.search(query);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  console.log("Calling Web search...");
  return finalResult;
}
