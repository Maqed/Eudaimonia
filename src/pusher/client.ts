import PusherClient from "pusher-js";
import { env } from "@/env";

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: "eu",
});
