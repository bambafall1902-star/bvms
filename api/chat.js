export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Bonjour 👋 Comment puis-je vous aider ?" }),
        { status: 200 }
      );
    }

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
            {
              role: "system",
              content: "Tu es un assistant professionnel de service client, poli, clair, multilingue. Tu aides toujours le client."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.5
        })
      }
    );

    const rawText = await response.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return new Response(
        JSON.stringify({ reply: "Réponse IA illisible.", debug: rawText }),
        { status: 200 }
      );
    }

    // 🔍 DEBUG IMPORTANT
    if (data?.error) {
      return new Response(
        JSON.stringify({
          reply: "Erreur IA.",
          debug: data.error
        }),
        { status: 200 }
      );
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return new Response(
        JSON.stringify({
          reply: "L’IA n’a pas répondu.",
          debug: data
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        reply: "Erreur serveur IA.",
        debug: err.message
      }),
      { status: 500 }
    );
  }
}
