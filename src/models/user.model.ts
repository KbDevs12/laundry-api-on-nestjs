export class RegisterUserRequest {
  email: string;
  fullName: string;
  phone: string;
  password: string;
}

export class UserResponse {
  error?: string;
  data?: {
    status: string;
    message: string;
  };
}
