export enum API_ENDPOINTS {
    auth_login = '/auth/login',
    auth_logout = '/auth/logout',
    auth_refresh = '/auth/refresh',
    auth_user = '/auth/user',
    bookings = '/bookings',
    bookings_$bookingId = '/bookings/:bookingId',
}

export enum LOCAL_STORAGE_KEYS {
    auth_token = 'auth_token',
    auth_token_expiration_timestamp = 'auth_token_expiration_timestamp',
}

export const HTTP_JSON_HEADERS: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};
