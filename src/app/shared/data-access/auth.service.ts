import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KeycloakEventType, KeycloakService } from "keycloak-angular";
import { filter, from, Subject, switchMap } from "rxjs";
import { environment } from "../../../environments/environment.development";

export interface AuthState {
  currentUser: string | null;
  accessToken: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakService = inject(KeycloakService);

  readonly #state = signal<AuthState>({
    currentUser: null,
    accessToken: null,
  });

  //selectors
  currentUser = computed(() => this.#state().currentUser);
  accessToken = computed(() => this.#state().accessToken);

  //sources
  login$ = new Subject<void>();
  logout$ = new Subject<void>();

  private readonly getToken$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed()
    );

  private readonly tokenExpired$ = this.keycloakService.keycloakEvents$
    .pipe(
      takeUntilDestroyed(),
      filter((event) => event.type === KeycloakEventType.OnTokenExpired),
      switchMap(() => from(this.keycloakService.updateToken(20)))
    );

  constructor() {
    this.initializeAuthState();

    this.login$.subscribe(() => {
      this.login();
    });

    this.logout$.subscribe(() => {
      this.logout();
    });

    this.tokenExpired$.subscribe(() => {
      this.getToken$.subscribe((token) => {
        this.#state.update((state) => ({
          ...state,
          accessToken: token,
        }));
      });
    });
  }

  private login() {
    if (!this.keycloakService.isLoggedIn()) {
      this.keycloakService.login();
    }
  }

  private logout() {
    this.keycloakService.logout(environment.keycloak.redirectUri);
  }

  private initializeAuthState() {
    if (this.keycloakService.isLoggedIn()) {
      this.getToken$.subscribe((token) => 
        this.#state.update((state) => ({
          ...state,
          currentUser: this.keycloakService.getUsername(),
          accessToken: token,
        }))
      );
    }
  }
}