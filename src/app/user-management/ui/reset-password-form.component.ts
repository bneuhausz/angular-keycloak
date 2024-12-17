import { Component, input, output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CreateUser } from "../interfaces/user";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password-form',
  imports: [ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="form()">
      <mat-form-field>
        <input matInput type="text" formControlName="username" placeholder="Username" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="text" formControlName="password" placeholder="Password" />
      </mat-form-field>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      mat-form-field {
        width: 90%;
      }
    `
  ]
})
export class ResetPasswordFormComponent {
  form = input.required<FormGroup>();
  userCreated = output<CreateUser>();
}