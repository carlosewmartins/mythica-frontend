import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth';

export const routes: Routes = [
  // Rota pública - Home
  {
    path: '',
    loadComponent: () => import('./features/pages/home/starter/starter').then(m => m.Starter),
    title: 'Mythica'
  },
  
  // Rotas protegidas - Personagens
  {
    path: 'personagens',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/pages/personagens/lista-personagens/lista-personagens').then(m => m.ListaPersonagens),
        title: 'Meus Personagens'
      }
    ]
  },
  // Pagina não encontrada
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];