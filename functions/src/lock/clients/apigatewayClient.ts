import {post} from "axios";
import {UnlockResponse} from "../types/unlock_response.type";
import {logger} from "firebase-functions";


/**
 * Este método é responsável por chamar a AWS para destrancar a fechadura
 * @param {string} lockId O ID da fechadura que deseja ser destrancada
 * @return {UnlockResponse} O resultado da operação
 */
export async function unlockLock(lockId: string): Promise<UnlockResponse> {
  try {
    const response = await post<UnlockResponse>("https://v37tho1q97.execute-api.sa-east-1.amazonaws.com/prod/unlock",
      {"lockId": lockId});
    if (response.status == 200 && response.data.success) {
      return response.data;
    }
  } catch (e: any) {
    logger.error("Erro ao chamar a API para destrancar a porta");
  }
  return {
    success: false,
    errorMessage: "INTEGRATION_ERROR",
    lockId: lockId,
  };
}
