export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: "Bonjour"
            }
          ]
        }),
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({ reply: data.choices?.[0]?.message?.content || "Pas de réponse" }),
      { status: 200 }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ reply: "Erreur Groq directe" }),
      { status: 500 }
    );
  }
}
