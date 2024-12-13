import { Component, inject } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../data-access/auth.service";

@Component({
  selector: "app-layout",
  template: `
    <mat-sidenav-container fullscreen>
      <mat-sidenav #sidenav>
        <mat-nav-list (click)="sidenav.close()">
          <a mat-list-item routerLink="/">
            <mat-icon matListItemIcon>home</mat-icon>
            <span>Home</span>
          </a>

          @if (authService.currentUser()) {
            <a mat-list-item>
              <mat-icon matListItemIcon>person_add</mat-icon>
              <span>User is logged in</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>
      <app-header [sidenav]="sidenav"></app-header>
      <router-outlet></router-outlet>
    </mat-sidenav-container>
  `,
  styles: [`

  `],
  imports: [HeaderComponent, RouterOutlet, MatSidenavModule, MatListModule, RouterLink, MatIconModule],
})
export class LayoutComponent {
  authService = inject(AuthService);
}