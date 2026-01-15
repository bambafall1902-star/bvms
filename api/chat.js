export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Veuillez écrire un message." }),
        { status: 200 }
      );
    }

    const prompt = `
Tu es un assistant professionnel de service client.
Tu réponds clairement, poliment et utilement.
Tu comprends toutes les langues.
Ne dis jamais que tu ne comprends pas.

Client: ${message}
Assistant:
`;

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true }
        })
      }
    );

    const data = await hfResponse.json();

    let reply = "Je suis là pour vous aider.";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } 
    else if (data?.generated_text) {
      reply = data.generated_text;
    } 
    else if (data?.error) {
      reply = "Le service IA est temporairement indisponible.";
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
