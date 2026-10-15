export class RegisterUserRequest {
  email: string;
  fullName: string;
  phone: string;
  password: string;
}

export class LoginUserRequest {
  idToken: string;
}

export class Profile {
  email: string;
  fullName: string;
  phone: string;
  role: string;
}

export class UserResponse {
  status: string;
  message: string;
  profile?: Profile;
}
