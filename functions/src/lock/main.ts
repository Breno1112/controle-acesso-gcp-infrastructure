import {CallableRequest, CallableResponse} from "firebase-functions/https";
import {UnlockRequest} from "../types/unlock_request.type";
import {UnlockResponse} from "../types/unlock_response.type";
import {logger} from "firebase-functions";

/**
 * Função responsável por validar se o usuário
 * tem permissão de destravar a fechadura e,
 * caso sim, destravá-la, se comunicando com o
 * API Gateway da AWS
 * @param {CallableRequest<UnlockRequest>} request
 * Objeto contendo o HTTP Request inteiro
 * @param {CallableResponse<UnlockResponse>} response
 * Objeto que manipula o
 * HTTP Response que será devolvido
 */
export async function lockHandler(
  request: CallableRequest<UnlockRequest>,
  response: CallableResponse<UnlockResponse> | undefined
) {
  logger.info(`O ID do usuário é ${request.auth?.uid}`);
  if (request.auth?.uid == undefined) {
    return sendUnauthenticatedUser();
  }
  return {
    lockId: request.data.lockId,
    success: true,
  };
}

/**
 * Este método é uma convenção para devolver o status de usuário não autorizado
 * @param {Response} response Objeto que manipula o
 * HTTP response que será devolvido
 * @return {object} o objeto padronizado de retorno de usuário não autenticado
 */
function sendUnauthenticatedUser(): object {
  return {
    success: false,
    errorMessage: "UNAUTHENTICATED_USER",
  };
}
