import * as admin from "firebase-admin";
import {LockEntity} from "../types/lock_entity.type";
import {UserEntity} from "../types/user_entity.type";
import {logger} from "firebase-functions";

/**
 * Esta função é responsável por salvar o log de
 * destravamento da fechadura X pelo usuário Y
 *
 * @param {string} lockId ID da fechadura
 * @param {string} userId ID do usuário que realizou a operação
 * @return {Promise<boolean>} Um resultado assíncrono
 * com um valor verdadeiro caso o log seja salvo
 * com sucesso ou falso caso contrário
 */
export async function insertUnlockAccessLog(
  lockId: string, userId: string
): Promise<boolean> {
  let result = false;
  try {
    admin.initializeApp();
    const firestore = admin.firestore();
    const user = await firestore.collection("users").doc(userId).get();
    if (user.exists) {
      const userData = user.data() as UserEntity;
      const lock = await firestore
        .collection("users")
        .doc(userId)
        .collection("locks")
        .doc(lockId)
        .get();
      if (lock.exists) {
        const lockData = lock.data() as LockEntity;
        const ref = await firestore.collection("access_logs").doc();
        await ref.set({
          id: ref.id,
          lock: {
            id: lockData.id,
            locked: false,
            name: lockData.name,
          },
          user: {
            id: userData.id,
            name: userData.name,
          },
          timestamp: admin.firestore.Timestamp.now(),
        });
        result = true;
      }
    }
  } catch (e) {
    logger.error(`Erro ao atualizar logs de 
        acesso para o lockId: ${lockId} 
        para o usuário ${userId}. 
        Retornando: ${result}`, e);
  }
  return result;
}
