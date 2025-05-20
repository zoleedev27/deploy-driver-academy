export const COOKIE_CONSENT = 'cookie_consent';
export const API_URL = "https://backend-spring2025.web-staging.eu/api";
export const TOKEN_NAME = "access_token";
export const LARAVEL_ERRORS : Record<string, string> = {
    "The email has already been taken." : "rest.register.message",
    "Username or password does not match" : "rest.login.message",
    "The selected email is invalid." : "rest.forgot.password.message",
    "Please wait before retrying." : "rest.forgot.password.time",
    "Too Many Attempts." : "rest.forgot.password.many.attempts"
}