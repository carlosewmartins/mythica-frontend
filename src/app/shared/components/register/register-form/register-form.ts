import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password'
import { DividerModule } from 'primeng/divider'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    PasswordModule,
    DividerModule
  ],
  standalone: true,
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})
export class RegisterForm {
  messageService = inject(MessageService);

  registerForm: FormGroup;

  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]]
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      this.messageService.add({ 
        severity: 'success',
        summary: 'Sucesso!',
        detail: 'Voce se registrou com sucesso!',
        life: 5000
      });
      this.registerForm.reset();
      this.formSubmitted = false;
    }
  }

  isInvalid(field: string) {
      const control = this.registerForm.get(field);
      return control?.invalid && (control.touched || this.formSubmitted);
  }

}
