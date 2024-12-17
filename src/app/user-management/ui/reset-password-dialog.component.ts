import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, Validators } from "@angular/forms";
import { ResetPasswordFormComponent } from "./reset-password-form.component";

@Component({
  host: { 'data-dialog': 'reset-password' },
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ResetPasswordFormComponent],
  template: `
    <h2 mat-dialog-title align="center">Reset Password</h2>
    <mat-dialog-content>
      <app-reset-password-form [form]="resetPasswordForm" />
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        [mat-dialog-close]="this.resetPasswordForm.getRawValue()"
        class="primary-button"
        [disabled]="resetPasswordForm.invalid"
        [class.disabled-button]="resetPasswordForm.invalid"
      >
        Reset
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        height: 160px;
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
export class ResetPasswordDialogComponent {
  user = inject(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  resetPasswordForm = this.fb.nonNullable.group({
    username: [{value: this.user.username, disabled: true}],
    password: ['', Validators.required],
  });
}