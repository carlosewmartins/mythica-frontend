import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';


// Auth Guard - Protege rotas que requerem autenticação
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está autenticado
  if (authService.isAuthenticated()) {
    return true;
  }

  // Se não está autenticado, redireciona para login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

// Public Guard - Impede usuarios autenticados de acessar paginas publicas
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se está autenticado, redireciona para home
  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};