import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router'

import { SideNavigationMenuComponent } from './side-navigation-menu.component'
@NgModule({
  declarations: [SideNavigationMenuComponent],
  imports: [
    CommonModule,
    MatListModule,
    RouterLinkActive,
    RouterLink,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule { }
