export interface JwtPayload {
    email: string,
    id: number,
    iat: number,
    exp: number
}