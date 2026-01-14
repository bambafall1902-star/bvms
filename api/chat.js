export const config = { runtime: "edge" };

export default async function handler(req) {
  return new Response(
    JSON.stringify({ reply: "Bonjour ✅ le serveur marche" }),
    { status: 200 }
  );
}
