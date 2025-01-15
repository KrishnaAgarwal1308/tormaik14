// import type { NextApiRequest, NextApiResponse } from "next";
// import { HfInference } from "@huggingface/inference";

// const hf = new HfInference(process.env.HUGGINGFACE_API_KEY as string);

// type ChatRequestBody = {
//   inputText: string;
// };

// type ChatResponse = {
//   response: string;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ChatResponse | { message: string }>
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Only POST requests are allowed" });
//   }

//   const { inputText } = req.body as ChatRequestBody;

//   if (!inputText) {
//     return res.status(400).json({ message: "Input text is required" });
//   }

//   try {
//     const result = await hf.conversational({
//       model: "krishnaagarwal1308/llama-3-8b-Instruct-bnb-4bit-ksitij-team", // Replace with your preferred model
//       inputs: {
//         past_user_inputs: [],
//         generated_responses: [],
//         text: inputText,
//       },
//     });

//     res.status(200).json({ response: result.generated_text });
//   } catch (error) {
//     console.error("Error with Hugging Face Inference:", error);
//     res.status(500).json({ message: "Error processing the request." });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";

type ChatRequestBody = {
  inputText: string;
};

type ChatResponse = {
  response: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | { message: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { inputText } = req.body as ChatRequestBody;

  if (!inputText) {
    return res.status(400).json({ message: "Input text is required" });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/krishnaagarwal1308/llama-3-8b-Instruct-bnb-4bit-ksitij-team", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: [],
          generated_responses: [],
          text: inputText,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from Hugging Face API");
    }

    const data = await response.json();
    res.status(200).json({ response: data.generated_text });
  } catch (error) {
    console.error("Error with Hugging Face API:", error);
    res.status(500).json({ message: "Error processing the request." });
  }
}
