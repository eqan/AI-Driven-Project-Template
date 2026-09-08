export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthenticatedUser = {
  sub: string;
  email: string;
  name: string;
  picture: string;
  exp?: number;
};

export type StoredAuthSession = {
  token: string;
  user: AuthenticatedUser;
};

export type GoogleLoginResponse = {
  status: boolean;
  message: string;
  result: {
    token: string;
    user_info: {
      sub: string;
      email: string;
      name: string;
      picture?: string;
      exp?: number;
    };
  };
};

export type VerifyTokenResponse = {
  status: boolean;
  user: AuthenticatedUser;
};
