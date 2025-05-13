import { enableProdMode } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { Amplify } from 'aws-amplify'

import { AppComponent } from './app/app.component'
import { appConfig } from './app/app.config'
import { awsconfig, environment } from './environments/environment'

Amplify.configure(awsconfig)

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.log(err))
