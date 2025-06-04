export interface ISignUp {
  username: string
  password: string
}

export interface ISignUpConfirmation {
  username: string
  confirmationCode: string
}
export interface IForgotPassword {
  username: string
}
export interface IChangePassword {
  username: string
  confirmationCode: string
  password: string
}
