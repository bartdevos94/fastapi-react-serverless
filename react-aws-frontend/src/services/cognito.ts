// src/services/cognito.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
}

export class CognitoService {
  private userPool: CognitoUserPool

  constructor() {
    this.userPool = new CognitoUserPool(poolData)
  }

  getCurrentUser(): CognitoUser | null {
    return this.userPool.getCurrentUser()
  }

  signUp(email: string, password: string, attributes: Record<string, string> = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const attributeList = Object.entries(attributes).map(
        ([key, value]) => new CognitoUserAttribute({ Name: key, Value: value })
      )

      this.userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  confirmSignUp(email: string, confirmationCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = { Username: email, Pool: this.userPool }
      const cognitoUser = new CognitoUser(userData)

      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  signIn(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      })

      const userData = { Username: email, Pool: this.userPool }
      const cognitoUser = new CognitoUser(userData)

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // Handle new password required
          reject(new Error('New password required'))
        },
      })
    })
  }

  signOut(): Promise<void> {
    return new Promise((resolve) => {
      const cognitoUser = this.getCurrentUser()
      if (cognitoUser) {
        cognitoUser.signOut(() => resolve())
      } else {
        resolve()
      }
    })
  }

  getSession(): Promise<any> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser()
      if (!cognitoUser) {
        reject(new Error('No current user'))
        return
      }

      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(session)
      })
    })
  }

  forgotPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = { Username: email, Pool: this.userPool }
      const cognitoUser = new CognitoUser(userData)

      cognitoUser.forgotPassword({
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      })
    })
  }

  confirmPassword(email: string, confirmationCode: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = { Username: email, Pool: this.userPool }
      const cognitoUser = new CognitoUser(userData)

      cognitoUser.confirmPassword(confirmationCode, newPassword, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      })
    })
  }
}

export const cognitoService = new CognitoService()