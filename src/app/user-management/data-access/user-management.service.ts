import { computed, inject, Injectable, signal } from "@angular/core";
import { Pagination, PartialPaginationWithoutTotal } from "../../shared/interfaces/pagination";
import { GetUserResponse, User } from "../interfaces/user";
import { KeycloakService } from "keycloak-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, EMPTY, from, startWith, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { environment } from "../../../environments/environment.development";

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

  constructor() {
    this.paginated$.subscribe();
  }

  private getUsers(token: string) {
    const first = (this.pagination().pageIndex) * this.pagination().pageSize;
    const max = (this.pagination().pageIndex + 1) * this.pagination().pageSize;
    const filter = this.#state().filter;
    return this.http.get<GetUserResponse>(`${environment.api.url}/users?first=${first}&max=${max}&username=${filter}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }
}