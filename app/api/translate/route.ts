import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.input;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You translate corporate business language into blunt, honest language.

Rules:
- Be concise
- Be funny but believable
- Sound like a tired employee
- Keep responses under 2 sentences
          `,
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
