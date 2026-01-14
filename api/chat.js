export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { message } = await req.json();

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant de service client professionnel. Réponds clairement dans la langue du client."
            },
            {
              role: "user",
              content: message || "Bonjour"
            }
          ],
          temperature: 0.3
        }),
      }
    );

    const data = await groqResponse.json();

    if (!data.choices || !data.choices[0]) {
      return new Response(
        JSON.stringify({ reply: "❌ Réponse IA vide" }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ reply: data.choices[0].message.content }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "❌ Erreur serveur IA" }),
      { status: 500 }
    );
  }
}
