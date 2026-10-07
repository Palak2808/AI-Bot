const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Guide the user through the solution step by step.",
    },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "math_response",
      strict: true,
      schema: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                explanation: { type: "string" },
                output: { type: "string" },
              },
              required: ["explanation", "output"],
              additionalProperties: false,
            },
          },
          final_answer: { type: "string" },
        },
        required: ["steps", "final_answer"],
        additionalProperties: false,
      },
    },
  },
});

const result = JSON.parse(response.choices[0].message.content || "{}");
console.log(result);

// async function main() {
//   const completion = await groq.chat.completions.create({
//     response_format: { type: "json_object" }, //Enable JSON Object Mode (for reliable structured output) (Telling the API itself that The output needs to be a valid JSON object.)
//     model: "openai/gpt-oss-20b",
//     messages: [
//       {
//         role: "system",
//         // content: "You are Pal, a smart personal assistant.",

//         //For structured output (The prompt tells the model what the JSON should contain.)
//         content: `You must return valid JSON structure.
//         example: Here are the features of the required car: {
//         name :"Toyota",
//         model :"Camry",
//         year :2020
//         }`,
//       },
//       {
//         role: "user",
//         content: "Describe me the features of Toyota car.",
//       },
//       //   {
//       //     role: "assistant",
//       //     content: "I am an AI language model created by OpenAI.",
//       //   },
//     ],
//   });

//   //   console.log(completion.choices[0].message.content);
//   console.log(JSON.parse(completion.choices[0].message.content));
// }
