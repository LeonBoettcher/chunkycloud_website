import "server-only";
import { createClient } from "./api-client/client";
import { apiUrl } from "./config";

export const serverApiClient = createClient({ baseUrl: apiUrl });
