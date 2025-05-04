import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-page-not-found',
    template: `
    <p>
      This page doesn't exist. Go back to
      <a routerLink="/home">home</a>
      .
    </p>
  `,
    imports: [RouterLink]
})
export class PageNotFoundComponent {}
