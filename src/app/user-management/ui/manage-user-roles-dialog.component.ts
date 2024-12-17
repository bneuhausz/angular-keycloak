import { Component, inject, output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EditUserRole } from "../interfaces/role";

@Component({
  host: { 'data-dialog': 'manage-user-roles' },
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title align="center">Manage User Roles</h2>
    <mat-dialog-content align="center">
      <section>
        @for (role of data.roles(); track role.id) {
          <mat-checkbox [checked]="role.isInRole" (change)="this.roleToggled.emit({ userId: this.data.user.id, roleId: role.id, roleName: role.name, checked: $event.checked })">
            {{ role.name }}
          </mat-checkbox>
        }
      </section>
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
      }

      section {
        width: fit-content;
        min-width: 150px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      mat-checkbox {
        margin: 5px 0;
      }
    `
  ]
})
export class ManageUserRolesDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  roleToggled = output<EditUserRole>();
}