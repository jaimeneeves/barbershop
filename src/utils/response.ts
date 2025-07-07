/**
 * Cria uma resposta JSON com o status e mensagem fornecidos.
 * @param message - Mensagem ou objeto a ser retornado no corpo da resposta.
 * @param status - Código de status HTTP.
 * @returns Response - Objeto de resposta HTTP.
 */
export function jsonResponse(message: unknown, status: number): Response {
  return new Response(
    typeof message === 'string' ? message : JSON.stringify(message),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}