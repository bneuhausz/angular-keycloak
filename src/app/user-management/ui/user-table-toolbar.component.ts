import { Component, input, output } from "@angular/core";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-user-table-toolbar",
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  template: `
    <mat-toolbar>
      <mat-form-field id="username-filter">
        <input
          matInput
          placeholder="Filter username"
          type="text"
          [formControl]="filterControl()"
        />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      <span class="spacer"></span>
      <button mat-icon-button 
        (click)="create.emit()"
        matTooltip="Create user"
        matTooltipPosition="above"
      >
        <mat-icon>add</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [
    `
      #username-filter {
        padding-top: 20px;
        margin-right: 15px;
        width: 100%;
      }
      
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ]
})
export class UserTableToolbarComponent {
  filterControl = input.required<FormControl>();
  create = output<void>();
}