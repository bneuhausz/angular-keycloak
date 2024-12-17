import { Component, effect, inject } from "@angular/core";
import { UserManagementService } from "./data-access/user-management.service";
import { UserTableComponent } from "./ui/user-table.component";
import { UserTableToolbarComponent } from "./ui/user-table-toolbar.component";
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateUserDialogComponent } from "./ui/create-user-dialog.component";
import { ResetPasswordDialogComponent } from "./ui/reset-password-dialog.component";

@Component({
  imports: [UserTableComponent, MatCardModule, UserTableToolbarComponent],
  providers: [UserManagementService],
  template: `
    <main>
      <h1>User Management</h1>
      <mat-card>
        <app-user-table-toolbar
          [filterControl]="userManagementService.filterControl"
          (create)="openCreateDialog()"
        />
        <app-user-table
          [users]="userManagementService.users()"
          [loading]="userManagementService.loading()"
          [pagination]="userManagementService.pagination()"
          (toggleEnabled)="userManagementService.toggleEnabled$.next($event)"
          (resetPassword)="openResetPasswordDialog($event)"
          (pageChange)="userManagementService.pagination$.next($event)"
        />
      </mat-card>
    </main>
  `,
  styles: [
    `
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      mat-card {
        width: 1000px;
        margin: 20px 10px;
        padding: 20px 0;
      }
    `,
  ],
})
export default class UserManagementComponent {
  readonly userManagementService = inject(UserManagementService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.createUser$.next(result);
      }      
    });
  }

  openResetPasswordDialog(id: string) {
    const user = this.userManagementService.users().find(user => user.id === id);
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.resetPassword$.next({ id, data: { value: result.password } });
      }      
    });
  }

  constructor() {
    effect(() => {
      if (this.userManagementService.error()) {
        this.snackBar.open(this.userManagementService.error() as string, 'Close', {
          horizontalPosition: 'center',
          panelClass: 'error-snackbar',
        });
      }
    });
  }
}