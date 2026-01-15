export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { message } = await req.json();

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
              content: "Tu es un assistant professionnel de service client, poli, clair, multilingue."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return new Response(
        JSON.stringify({ reply: "L’IA n’a pas répondu." }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ reply: "Erreur serveur IA." }),
      { status: 500 }
    );
  }
}
