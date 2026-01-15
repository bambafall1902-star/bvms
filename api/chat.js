export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Pouvez-vous préciser votre demande ?" }),
        { status: 200 }
      );
    }

    const prompt = `
### Instruction:
Tu es un assistant professionnel de service client, similaire à celui d’Amazon.
Tu réponds toujours clairement, poliment et utilement.
Tu comprends toutes les langues.
Tu aides le client même si sa question est simple ou mal formulée.
Ne dis jamais "je n’ai pas compris".
Donne toujours une réponse utile.

### Client:
${message}

### Réponse:
`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.4,
            return_full_text: false
          }
        }),
      }
    );

    const data = await response.json();

    let reply = "Je suis là pour vous aider. Pouvez-vous préciser ?";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text.trim();
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "Erreur serveur IA" }),
      { status: 500 }
    );
  }
}
