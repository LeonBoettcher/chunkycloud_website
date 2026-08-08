import { createClient } from "./api-client/client";
import { apiUrl } from "./config";

export const publicApiClient = createClient({ baseUrl: apiUrl });
