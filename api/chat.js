export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    // 🔹 Lire le body correctement
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "❌ Message vide reçu" }),
        { status: 200 }
      );
    }

    // 🔹 Appel GROQ
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant de service client professionnel. Réponds dans la langue du client."
            },
            {
              role: "user",
              content: message
            }
          ],
        }),
      }
    );

    const data = await response.json();

    // 🔹 Vérification réponse
    if (!data.choices || !data.choices[0]) {
      return new Response(
        JSON.stringify({ reply: "❌ GROQ n’a pas renvoyé de réponse" }),
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
