import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../shared/data-access/auth.service';
import { Router } from '@angular/router';

@Component({
  host: { 'route': 'unauthorized' },
  template: `
    <p>You are unauthorized to use this application. Please log in.</p>
  `,
})
export default class UnauthorizedComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.currentUser()) {
        this.router.navigate(['home']);
      }
    });
  }
}