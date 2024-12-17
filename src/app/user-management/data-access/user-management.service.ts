import { computed, inject, Injectable, signal } from "@angular/core";
import { Pagination, PartialPaginationWithoutTotal } from "../../shared/interfaces/pagination";
import { CreateUser, GetUserResponse, ResetUserPassword, User } from "../interfaces/user";
import { KeycloakService } from "keycloak-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, debounceTime, distinctUntilChanged, EMPTY, from, startWith, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { environment } from "../../../environments/environment.development";
import { FormControl } from "@angular/forms";

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
  filter: string;
  pagination: Pagination;
}

@Injectable()
export class UserManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);
  filterControl = new FormControl();

  readonly #state = signal<UserManagementState>({
    users: [],
    loading: true,
    error: null,
    filter: '',
    pagination: {
      total: 0,
      pageIndex: 0,
      pageSize: 5,
    }
  });

  users = computed(() => this.#state().users);
  loading = computed(() => this.#state().loading);
  error = computed(() => this.#state().error);
  pagination = computed(() => this.#state().pagination);

  private readonly filterChanged$ = this.filterControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      tap((filter) => {
        this.#state.update((state) => ({
          ...state,
          filter,
          pagination: {
            ...state.pagination,
            pageIndex: 0,
          },
        }));
      }),
      switchMap(() => this.loadUsers$)
    );

  pagination$ = new Subject<PartialPaginationWithoutTotal>();
  private readonly paginated$ = this.pagination$
    .pipe(
      takeUntilDestroyed(),
      startWith(this.pagination()),
      tap((pagination) => {
        this.#state.update((state) => ({
          ...state,
          pagination: {
            total: state.pagination.total,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize
          }
        }));
      }),
      switchMap(() => this.loadUsers$),
    );

  private readonly loadUsers$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap((token) =>
        this.getUsers(token)
      ),
      tap((res) => {
        this.#state.update((state) => ({
          ...state,
          users: res.users,
          pagination: {
            ...state.pagination,
            total: res.count,
          },
          loading: false,
        }));
      }),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
      }),
    );

  createUser$ = new Subject<CreateUser>();
  private readonly userCreated$ = this.createUser$
    .pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.#state.update((state) => ({
          ...state,
          loading: true,
        }));
      }),
      switchMap((user) =>
        from(this.keycloakService.getToken()).pipe(
          switchMap((token) => this.createUser(token, user)),
          switchMap(() => this.loadUsers$),
        )
      ),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
      }),
    );

  toggleEnabled$ = new Subject<string>();
  private readonly enabledToggled$ = this.toggleEnabled$
    .pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.#state.update((state) => ({
          ...state,
          loading: true,
        }));
      }),
      switchMap((id) =>
        from(this.keycloakService.getToken()).pipe(
          switchMap((token) =>
            this.toggleEnabled(token, id)
          ),
          switchMap(() => this.loadUsers$),
        )
      ),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
      }),
    );

  resetPassword$ = new Subject<ResetUserPassword>();
  private readonly passwordReset$ = this.resetPassword$
    .pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.#state.update((state) => ({
          ...state,
          loading: true,
        }));
      }),
      switchMap((user) =>
        from(this.keycloakService.getToken()).pipe(
          switchMap((token) => this.resetPassword(token, user)),
        )
      ),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
      }),
    );

  constructor() {
    this.paginated$.subscribe();
    this.filterChanged$.subscribe();
    this.userCreated$.subscribe();
    this.enabledToggled$.subscribe();

    this.passwordReset$.subscribe(() => {
      this.#state.update((state) => ({
        ...state,
        loading: false,
      }));
    });
  }

  private getUsers(token: string) {
    const first = (this.pagination().pageIndex) * this.pagination().pageSize;
    const max = (this.pagination().pageIndex + 1) * this.pagination().pageSize;
    const filter = this.#state().filter;
    return this.http.get<GetUserResponse>(`${environment.api.url}/users?first=${first}&max=${max}&username=${filter}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  private createUser(token: string, user: CreateUser) {
    return this.http.post(
      `${environment.api.url}/users`,
      { user },
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private toggleEnabled(token: string, id: string) {
    return this.http.put(
      `${environment.api.url}/users/${id}`,
      {},
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private resetPassword(token: string, user: ResetUserPassword) {
    return this.http.put(
      `${environment.api.url}/users/${user.id}/reset-password`,
      { credential: user.data },
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }
}