import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { ApplicationConfig } from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { provideEntityData } from '@ngrx/data'
import { provideEffects } from '@ngrx/effects'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { environment } from 'src/environments/environment'

import { routes } from './app.routes'
import { authFactory } from './auth/auth.factory'
import { AuthHttpInterceptor } from './auth/auth.http.interceptor'
import { AuthService } from './auth/auth.service'
import { LoadingHttpInterceptor } from './common/loading.http.interceptor'
import { provideUiService } from './common/ui.service'
import { entityConfig } from './entity-metadata'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([AuthHttpInterceptor, LoadingHttpInterceptor])),
    provideRouter(routes), // withDebugTracing()
    provideStore(),
    provideEffects(),
    provideEntityData(entityConfig),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      connectInZone: true,
      // trace: true,
    }),
    {
      provide: AuthService,
      useFactory: authFactory,
    },
    provideUiService(),
  ],
}
