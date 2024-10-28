export class User {
  id!: string;
  email!: string;
  name!: string;
  address!: string;
  token!: string;
  isAdmin!: boolean;
}

// Class or interface for registering a new user
export interface UserRegister {
  name: string;
  email: string;
  password: string;
  address: string;
}
