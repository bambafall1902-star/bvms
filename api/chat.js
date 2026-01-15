export default function handler() {
  return new Response(
    JSON.stringify({
      message: "API OK - le serveur fonctionne"
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
