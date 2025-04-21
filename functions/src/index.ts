import {lockHandler} from "./lock/main";
import {onCall} from "firebase-functions/v2/https";

export const lock = onCall((request, response) =>
  lockHandler(request, response));
