import { Component, inject } from "@angular/core";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { CreateUserFormComponent } from "./create-user-form.component";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  host: { 'data-dialog': 'create-user' },
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, CreateUserFormComponent],
  template: `
    <h2 mat-dialog-title align="center">Create User</h2>
    <mat-dialog-content>
      <app-create-user-form [form]="userForm" />
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        [mat-dialog-close]="this.userForm.getRawValue()"
        class="primary-button"
        [disabled]="userForm.invalid"
        [class.disabled-button]="userForm.invalid"
      >
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        height: 130px;
        width: 400px;
      }

      .primary-button {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      .disabled-button {
        background-color: var(--mat-sys-outline-variant);
      }
    `
  ]
})
export class CreateUserDialogComponent {
  private readonly fb = inject(FormBuilder);

  userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    enabled: false,
  });
}