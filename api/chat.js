export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const body = await req.json();
    const message = body.message || "Dis bonjour";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({
        ok: true,
        groq_response: data
      }),
      { status: 200 }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: e.message
      }),
      { status: 500 }
    );
  }
}
