import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, finalize } from 'rxjs';
import { ApiService } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  username: string;  
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Signal do usuário atual (null se não autenticado)
  currentUser = signal<User | null>(null);

  // verifica se está autenticado
  isAuthenticated = computed(() => !!this.currentUser());

  isLoading = signal(false);
  
  constructor() {this.initializeAuth();}

  // Inicializa autenticação verificando token existente
  private initializeAuth(): void {
    if (this.apiService.hasToken()) {
      // Se tem token, busca dados do usuário
      this.getMe().subscribe({
        error: () => {
          // Se falhar (token inválido), limpa tudo
          this.clearAuth();
        }
      });
    }
  }

  // Entrar
  login(credentials: LoginCredentials): Observable<TokenResponse> {
    this.isLoading.set(true);

    return this.apiService.postForm<TokenResponse>('/auth/login', credentials, false)
      .pipe(
        tap((response) => {
          // Salva o token
          this.apiService.setToken(response.access_token);

          // Busca dados do usuário
          this.getMe().subscribe();
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      );
  }

  // Registrar
  signup(data: SignupData): Observable<User> {
    this.isLoading.set(true);

    return this.apiService.post<User>('/auth/signup', data, false)
      .pipe(
        tap(() => {
          this.isLoading.set(false);

          // Após registro, faz login automático
          this.login({
            username: data.email,
            password: data.password
          }).subscribe();
        })
      );
  }

  // Busca perfil
  getMe(): Observable<User> {
    this.isLoading.set(true);

    return this.apiService.get<User>('/auth/me')
      .pipe(
        tap((user) => {
          // Atualiza o signal do usuário
          this.currentUser.set(user);
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      );
  }

  // Logout
  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  // Limpa autenticação
  private clearAuth(): void {
    this.apiService.removeToken();
    this.currentUser.set(null);
    this.isLoading.set(false);
  }


  // Verifica se há token
  hasToken(): boolean {
    return this.apiService.hasToken();
  }

  // Retorna dados do usúario
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // Verifica se autenticado
  checkAuthentication(): boolean {
    return this.isAuthenticated();
  }
}