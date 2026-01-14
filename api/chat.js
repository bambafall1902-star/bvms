export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    return new Response(
      JSON.stringify({
        reply: process.env.GROQ_API_KEY
          ? "✅ Clé Groq détectée"
          : "❌ Clé Groq NON détectée"
      }),
      { status: 200 }
    );
  } catch {
    return new Response(
      JSON.stringify({ reply: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
