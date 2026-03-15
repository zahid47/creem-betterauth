import { createAuthClient } from "better-auth/react";
import { creemClient } from "@creem_io/better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [creemClient(), organizationClient()],
});
