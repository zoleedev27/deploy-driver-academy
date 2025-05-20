export interface IResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}