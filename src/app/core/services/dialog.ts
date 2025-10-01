import { Injectable, signal } from '@angular/core';

export type DialogType = 'login' | 'register' | null;

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  // Signal que controla qual dialog esta aberto
  private activeDialog = signal<DialogType>(null);
  
  // Computed para verificar qual dialog esta ativo
  activeDialog$ = this.activeDialog.asReadonly();

  // URL para redirecionar após login bem-sucedido
  private returnUrl = signal<string>('/personagens');
  returnUrl$ = this.returnUrl.asReadonly();

  // Abre dialog de login (opcional: retorna para url anterior)
  openLogin(returnUrl?: string): void {
    if (returnUrl) {
      this.returnUrl.set(returnUrl);
    }
    this.activeDialog.set('login');
  }

  // Abre dialog de cadastro
  openRegister(): void {
    this.activeDialog.set('register');
  }

  // fecha qualquer dialog ativo
  close(): void {
    this.activeDialog.set(null);
  }
  // Verifica se há dialog ativo
  isOpen(): boolean {
    return this.activeDialog() !== null;
  }

  // verifica se há dialog de login aberto
  isLoginOpen(): boolean {
    return this.activeDialog() === 'login';
  }

  // verifica se há dialog de registro aberto
  isRegisterOpen(): boolean {
    return this.activeDialog() === 'register';
  }

  // Retorna e limpa url
  getAndClearReturnUrl(): string {
    const url = this.returnUrl();
    this.returnUrl.set('/personagens');
    return url;
  }
}