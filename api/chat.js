export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Message vide reçu." }),
        { status: 200 }
      );
    }

    const prompt = `
Tu es un assistant IA de service client de niveau entreprise, similaire aux assistants utilisés par Amazon.

Règles STRICTES :
- Tu es poli, calme, professionnel et rassurant.
- Tu réponds clairement, avec des phrases simples et précises.
- Tu comprends et réponds automatiquement dans la langue du client.
- Tu aides le client même si sa question est mal formulée.
- Tu proposes des solutions concrètes.
- Tu ne dis jamais "je ne sais pas" sans proposer une alternative.
- Tu peux expliquer des produits, prix, commandes, livraisons, horaires, remboursements, problèmes techniques et réclamations.
- Tu poses UNE question de clarification seulement si c’est nécessaire.
- Tu ne révèles jamais que tu es une IA ou un modèle.

Style :
- Ton ton est professionnel, chaleureux et confiant.
- Tes réponses sont structurées et faciles à lire.
- Tu ne fais pas de réponses trop longues.
- Tu peux utiliser des listes quand c’est utile.

Client : ${message}
Assistant :
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
        }),
      }
    );

    const data = await response.json();

    let reply = "Je n'ai pas compris votre demande.";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text.split("Assistant :").pop().trim();
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "Erreur serveur IA." }),
      { status: 500 }
    );
  }
}
