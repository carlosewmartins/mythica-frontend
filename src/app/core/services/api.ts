import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { env } from '../../../env/env';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = env.apiUrl;

  // Retorna Headers
  private getHeaders(includeAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  // Obtem Token no localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Salva Token no localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Remove Token localStorage
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Verifica se há Token
  hasToken(): boolean {
    return !!this.getToken();
  }

  // Tratamento de erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';

      if (error.status === 401) {
        errorMessage = 'Não autorizado. Faça login novamente.';
        this.removeToken();
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status === 400) {
        errorMessage = error.error?.detail || 'Dados inválidos.';
      } else {
        errorMessage = error.error?.detail || `Erro ${error.status}: ${error.message}`;
      }
    console.error('Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // GET Wrapper
  get<T>(endpoint: string, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(requiresAuth);

    return this.http.get<T>(url, { headers })
  }

  // POST Wrapper
  post<T>(endpoint: string, body: any, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(requiresAuth);

    return this.http.post<T>(url, body, { headers })
  }


  postForm<T>(endpoint: string, body: any, requiresAuth: boolean = false): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Cria URLSearchParams (application/x-www-form-urlencoded)
    const formBody = new URLSearchParams();
    Object.keys(body).forEach(key => {
      formBody.append(key, body[key]);
    });

    // Headers para OAuth2
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<T>(url, formBody.toString(), { headers })
  }

  // DELETE Wrapper
  delete<T>(endpoint: string, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(requiresAuth);

    return this.http.delete<T>(url, { headers })
  }
}