import { AuthMode } from '../app/auth/auth.enum'

export const environment = {
  production: false,
  baseUrl: 'https://dev.api.paretofactory.com/v01',
  cognitoBaseUrl: 'https://dev.api.paretofactory.com',
  authMode: AuthMode.CustomServer,
}

export const awsconfig = {
  Auth: {
    Cognito: {
      region: 'us-west-2',
      userPoolId: 'us-west-2_kYxBT6G5H',
      userPoolClientId: '7172bfnjgp98t3pjhj0ktj7360',
    },
  },
}
