export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const data = await res.json();

    return new Response(
      JSON.stringify(data),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Erreur appel Groq" }),
      { status: 500 }
    );
  }
}
  
