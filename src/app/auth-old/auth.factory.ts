import { environment } from '../../environments/environment'
import { CustomAuthService } from './auth.custom.service'
import { AuthMode } from './auth.enum'
import { InMemoryAuthService } from './auth.in-memory.service'

export function authFactory() {
  switch (environment.authMode) {
    case AuthMode.InMemory:
      return new InMemoryAuthService()
    case AuthMode.CustomServer:
      return new CustomAuthService()
  }
}
