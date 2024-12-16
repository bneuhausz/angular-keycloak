import { Component, inject } from "@angular/core";
import { UserManagementService } from "./data-access/user-management.service";

@Component({
  imports: [],
  providers: [UserManagementService],
  template: `
    <main>
      <h1>User Management</h1>
    </main>
  `,
  styles: []
})
export default class UserManagementComponent {
  private readonly userManagementService = inject(UserManagementService);
}