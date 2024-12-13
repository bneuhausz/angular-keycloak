import { Component } from '@angular/core';
import { LayoutComponent } from './shared/ui/layout.component';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: `
    <app-layout />
  `,
})
export class AppComponent {}
