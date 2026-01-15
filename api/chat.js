export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Message vide" }),
        { status: 200 }
      );
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: message,
        }),
      }
    );

    const data = await response.json();

    let reply = "Je n'ai pas compris.";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ reply: "Erreur serveur IA" }),
      { status: 500 }
    );
  }
}
