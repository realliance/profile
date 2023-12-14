
export interface ReallianceIdJwt {
  iss: string;
  sub: string;
  aud: string;
  exp: string;
  iat: string;
  acr: string;
  name: string;
  given_name: string;
  preferred_username: string;
  nickname: string;
  groups: string[];
  azp: string;
  uid: string;
}