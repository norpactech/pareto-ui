import { AuthMode } from '../app/auth/auth.enum'

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`,
// but if you do `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl: 'http://v02.norpactech.com:8087/v01',
  // authMode: AuthMode.InMemory,
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
