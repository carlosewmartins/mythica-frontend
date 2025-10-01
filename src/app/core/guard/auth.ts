import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { DialogService } from '../services/dialog';

// Auth Guard - Protege rotas que requerem autenticação
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const dialogService = inject(DialogService);
  const router = inject(Router);

  // Verifica se está autenticado OU se tem token valido
  if (authService.isAuthenticated() || authService.hasToken()) {
    return true;
  }

  // Se nao esta autenticado, abre dialog de login e salva a URL que o usuário tentou acessar
  dialogService.openLogin(state.url);

  // Redireciona para home (landing) onde o dialog será mostrado
  router.navigate(['/']);

  return false;
};

// Public Guard - Impede usuarios autenticados de acessar paginas publicas
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se está autenticado, redireciona para lista de personagens
  if (authService.isAuthenticated()) {
    router.navigate(['/personagens']);
    return false;
  }

  return true;
};