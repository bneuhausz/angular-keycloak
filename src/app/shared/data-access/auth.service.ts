import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KeycloakEventType, KeycloakService } from "keycloak-angular";
import { EMPTY, filter, Subject, switchMap } from "rxjs";

export interface AuthState {
  currentUser: string | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakService = inject(KeycloakService);

  readonly #state = signal<AuthState>({
    currentUser: null,
    loading: false,
    error: null,
  });

  //selectors
  currentUser = computed(() => this.#state().currentUser);

  //sources
  login$ = new Subject<void>();
  logout$ = new Subject<void>();

  private readonly loggedOut$ = this.keycloakService.keycloakEvents$.pipe(
    takeUntilDestroyed(),
    filter(event => event.type === KeycloakEventType.OnAuthLogout),
    switchMap(() => EMPTY),
  );

  constructor() {
    if (this.keycloakService.isLoggedIn()) {
      this.#state.update((state) => ({
        ...state,
        currentUser: this.keycloakService.getUsername(),
        loading: false,
        error: null,
      }));
    }

    this.login$.subscribe(() => {
      this.keycloakService.login();
    });

    this.logout$.subscribe(() => {
      this.keycloakService.logout('http://localhost:4200');
    });

    this.loggedOut$.subscribe(() => {
      this.#state.update((state) => ({
        ...state,
        currentUser: null,
      }));
    });
  }
}