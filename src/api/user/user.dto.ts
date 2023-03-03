export class UserRegisterDto {
  username: string
  email: string
  password: string
}
export class UserLoginDto {
  username: string
  password: string
}
export class UserIdDto {
  id: string
}
export class UserEditByIdDto {
  oldEmail?: string
  email?: string
  oldPassword?: string
  password?: string
  about?: string
}