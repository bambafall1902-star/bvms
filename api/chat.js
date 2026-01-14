export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ reply: "Méthode non autorisée" }),
      { status: 405 }
    );
  }

  try {
    const { message, history = [] } = await req.json();

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
              role: "system",
              content:
                "Tu es un assistant professionnel de service client. Tu comprends et réponds dans la langue du client."
            },
            ...history,
            { role: "user", content: message }
          ],
          temperature: 0.4
        }),
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({ reply: data.choices[0].message.content }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ reply: "Erreur serveur IA" }),
      { status: 500 }
    );
  }
}
