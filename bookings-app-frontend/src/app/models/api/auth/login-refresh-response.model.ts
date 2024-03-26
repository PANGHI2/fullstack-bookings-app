type AuthTokenData = {
    access_token: string;
    token_type: string;
    expires_in: number;
};

export type LoginResponse = AuthTokenData;

export type RefreshResponse = AuthTokenData;
