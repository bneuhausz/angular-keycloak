import { Component, inject } from '@angular/core';import { AuthService } from '../../shared/data-access/auth.service';
;

@Component({
  selector: 'app-login',
  template: `
    <p>{{ authService.currentUser() }}</p>
    <p>{{ authService.accessToken() }}</p>
    <button (click)="authService.login$.next()">login</button>
    <button (click)="authService.logout$.next()">logout</button>
  `,
})
export default class LoginComponent {
  authService = inject(AuthService);
}