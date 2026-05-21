import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompts = {
  toEnglish: `
You translate corporate business language into blunt, honest language.

Rules:
- Be concise
- Be funny but believable
- Sound like a tired employee
- Keep responses under 2 sentences
          `,
  toCorporate: `
You translate plain English to corporate business language.

Rules:
- Be overly wordy, but professional
- Use corporate buzzwords
- Sound like an executive trying to be as vague as possible
- Keep responses under 2 sentences
          `,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.input;
    const direction = body.direction === "toCorporate" ? "toCorporate" : "toEnglish";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: prompts[direction],
        },
        {
          role: "user",
          content: `Translate this:\n\n${input}`,
        },
      ],
    });

    const translation =
      completion.choices[0]?.message?.content ??
      "Could not translate corporate nonsense.";

    return Response.json({
      translation,
    });
  } catch (error) {
    console.error(error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      {
        error: "Something went wrong.",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
