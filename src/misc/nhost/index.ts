import { createClient } from "nhost-js-sdk";

const origin = window.location.origin
export const BACKEND_ENDPOINT = 
  origin === 'http://localhost:3000' ? 'https://api.dentalmodelmaker.com/dev':
  'https://api.dentalmodelmaker.com/v1'

const client = createClient({
  baseURL: BACKEND_ENDPOINT,
});

const auth = client.auth;
const storage = client.storage;

export { auth, storage };
