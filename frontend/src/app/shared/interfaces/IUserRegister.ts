// src/app/shared/interfaces/IUserRegister.ts

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string; // Required for user registration
  address: string;
}
