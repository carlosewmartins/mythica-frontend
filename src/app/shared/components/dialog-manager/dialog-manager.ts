import { Component, inject, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog';
import { Login } from '../login/login-dialog/login';
import { Register } from '../register/register-dialog/register';

@Component({
  selector: 'app-dialog-manager',
  standalone: true,
  imports: [Login, Register],
  template: `
    <app-login 
      #loginDialog
      (loginCompleted)="onLoginCompleted()">
    </app-login>
    
    <app-register 
      #registerDialog>
    </app-register>
  `
})
export class DialogManager {
  private dialogService = inject(DialogService);
  private router = inject(Router);

  @ViewChild('loginDialog') loginDialog!: Login;
  @ViewChild('registerDialog') registerDialog!: Register;

  constructor() {
    // Effect que reage as mudanças do DialogService
    effect(() => {
      const activeDialog = this.dialogService.activeDialog$();
      
      // Aguarda o ViewChild estar disponivel
      setTimeout(() => {
        if (activeDialog === 'login' && this.loginDialog) {
          this.loginDialog.showDialog();
        } else if (activeDialog === 'register' && this.registerDialog) {
          this.registerDialog.showDialog();
        } else {
          // Fecha todos os dialogs
          if (this.loginDialog) this.loginDialog.closeDialog();
          if (this.registerDialog) this.registerDialog.closeDialog();
        }
      });
    });
  }


  // Quando logado com sucesso, redireciona para a URL salva ou para a lista de personagens
  
  onLoginCompleted(): void {
    const returnUrl = this.dialogService.getAndClearReturnUrl();
    this.dialogService.close();
    
    // Aguarda um pouco para fechar o dialog antes de redirecionar
    setTimeout(() => {
      this.router.navigate([returnUrl]);
    }, 300);
  }
}