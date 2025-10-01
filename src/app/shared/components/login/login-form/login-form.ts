import { Component, Output, EventEmitter, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    PasswordModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  @Output() closeDialog = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  loginForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    // Marca todos os campos como touched para mostrar erros
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const credentials = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `Bem-vindo, ${this.authService.currentUser()?.name}!`,
            life: 3000
          });

          this.isSubmitting = false;
          this.loginForm.reset();
          
          // Emite evento de sucesso (DialogManager vai lidar com redirecionamento  )
          this.loginSuccess.emit();
        },
        error: (err: Error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no login',
            detail: err.message || 'Email ou senha incorretos',
            life: 5000
          });
          this.isSubmitting = false;
        }
      });
    } else {
      // Mostra mensagem de validação
      const invalidFields: string[] = [];
      if (this.loginForm.get('email')?.invalid) {
        invalidFields.push('Email');
      }
      if (this.loginForm.get('password')?.invalid) {
        invalidFields.push('Senha');
      }

      const message = invalidFields.length > 0 
        ? 'Campos inválidos'
        : 'Preencha todos os campos corretamente';

      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: message,
        life: 3000
      });
    }
  }

  onCancel(): void {
    this.closeDialog.emit();
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}