import { Component, input, output } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { User } from "../interfaces/user";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Pagination, PartialPaginationWithoutTotal } from "../../shared/interfaces/pagination";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-user-table",
  imports: [MatTableModule, MatProgressSpinnerModule, MatSlideToggleModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatTooltipModule],
  template: `
    @if (loading()) {
      <section class="spinner-container">
        <mat-progress-spinner mode="indeterminate" diameter="100"></mat-progress-spinner>
      </section>
    }
    @else {
      <table mat-table [dataSource]="users()">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let user">
            {{ user.id }}
          </td>
        </ng-container>
        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef>Username</th>
          <td mat-cell *matCellDef="let user">
            {{ user.username }}
          </td>
        </ng-container>
        <ng-container matColumnDef="enabled">
          <th mat-header-cell *matHeaderCellDef>Enabled</th>
          <td mat-cell *matCellDef="let user">
            <mat-slide-toggle [checked]="user.enabled" (change)="toggleEnabled.emit(user.id)">
            </mat-slide-toggle>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let user">
            <button
              mat-mini-fab class="action-button"
              (click)="manageRoles.emit(user.id)"
              matTooltip="Manage roles"
              matTooltipPosition="above"
            >
              <mat-icon>group_add</mat-icon>
            </button>
            <button
              mat-mini-fab class="action-button"
              (click)="resetPassword.emit(user.id)"
              matTooltip="Reset password"
              matTooltipPosition="above"
            >
              <mat-icon>lock_reset</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns" id="user-table-header"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [pageSize]="pagination().pageSize" [pageSizeOptions]="[3, 5, 10]"
        [length]="pagination().total" [pageIndex]="pagination().pageIndex" (page)="pageEvent($event)">
      </mat-paginator>
    }
  `,
  styles: [
    `
      .spinner-container {
        display: flex;
        justify-content: center;
      }

      table {
        width: 100%;
      }

      #user-table-header {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      .mat-column-id {
        width: 350px;
      }

      .mat-column-enabled {
        width: 100px;
      }

      .mat-column-actions {
        width: 140px;
        text-align: center;
      }

      .action-button {
        margin: 0 5px;
      }
    `,
  ],
})
export class UserTableComponent {
  users = input.required<User[]>();
  loading = input.required<boolean>();
  pagination = input.required<Pagination>();
  resetPassword = output<string>();
  manageRoles = output<string>();
  toggleEnabled = output<string>();
  pageChange = output<PartialPaginationWithoutTotal>();

  displayedColumns = ['id', 'username', 'enabled', 'actions'];

  pageEvent(event: PageEvent) {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}