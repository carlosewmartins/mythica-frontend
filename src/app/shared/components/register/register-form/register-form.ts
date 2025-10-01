import { Component, inject, Output, EventEmitter } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password'
import { DividerModule } from 'primeng/divider'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    PasswordModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  standalone: true,
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})

export class RegisterForm {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isSubmitting = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]]
    });
  }

  onSubmit(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });

    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const signupData = {
        name: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.signup(signupData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `Bem-vindo, ${this.authService.currentUser()?.name}!`,
            life: 3000
          });

          this.isSubmitting = false;
          this.registerForm.reset();
          this.registerSuccess.emit();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
        },
        error: (err: Error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no registro',
            detail: err.message || 'Não foi possível completar o registro',
            life: 5000
          });
          this.isSubmitting = false;
        }
      });
    } else {
      const invalidFields: string[] = [];
      if (this.registerForm.get('username')?.invalid) {
        invalidFields.push('Nome');
      }
      if (this.registerForm.get('email')?.invalid) {
        invalidFields.push('Email');
      }
      if (this.registerForm.get('password')?.invalid) {
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

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
