import { computed, inject, Injectable, signal } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { catchError, EMPTY, from, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EditUserRole, Role } from "../interfaces/role";

interface RoleManagementState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class UserRoleManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);

  readonly #state = signal<RoleManagementState>({
    roles: [],
    loading: true,
    error: null,
  });

  roles = computed(() => this.#state().roles);
  loading = computed(() => this.#state().loading);
  error = computed(() => this.#state().error);

  userSelected$ = new Subject<string>();
  private readonly loadRoles$ = this.userSelected$
    .pipe(
      switchMap(userId => 
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.getRoles(token, userId)),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          })
        )
      )
    );

  addRole$ = new Subject<EditUserRole>();
  private readonly roleAdded$ = this.addRole$
    .pipe(
      takeUntilDestroyed(),
      tap(() => this.#state.update(state => ({ ...state, loading: true }))),
      switchMap(({ userId, roleId, roleName }) => 
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.addRole(token, userId, roleId, roleName)),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          })
        )
      )
    );

  removeRole$ = new Subject<EditUserRole>();
  private readonly roleRemoved$ = this.removeRole$
    .pipe(
      takeUntilDestroyed(),
      tap(() => this.#state.update(state => ({ ...state, loading: true }))),
      switchMap(({ userId, roleId, roleName }) => 
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.removeRole(token, userId, roleId, roleName)),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          })
        )
      )
    );

  clearRoles$ = new Subject<void>();
  private readonly rolesCleared$ = this.clearRoles$
    .pipe(
      takeUntilDestroyed(),
    );

  constructor() {
    this.loadRoles$.subscribe(res => {
      this.#state.update(state => ({
        ...state,
        roles: res.roles,
        loading: false
      }));
    });

    this.roleAdded$.subscribe(() => {
      this.#state.update(state => ({ ...state, loading: false }));
    });

    this.roleRemoved$.subscribe(() => {
      this.#state.update(state => ({ ...state, loading: false }));
    });

    this.clearRoles$.subscribe(() => this.#state.update(state => ({ ...state, roles: [] })));
  }

  private getRoles(token: string, userId: string) {
    return this.http.get<{roles: Role[]}>(
      `${environment.api.url}/users/${userId}/roles`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private addRole(token: string, userId: string, roleId: string, roleName: string) {
    return this.http.post(
      `${environment.api.url}/users/${userId}/roles`,
      { role: { id: roleId, name: roleName } },
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private removeRole(token: string, userId: string, roleId: string, roleName: string) {
    return this.http.delete(
      `${environment.api.url}/users/${userId}/roles`,
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        body: { role: { id: roleId, name: roleName } },
      }
    );
  }
}