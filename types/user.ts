export interface User {
  id: string;
  email: string | null;
  token: string;
  verified: boolean;
}
