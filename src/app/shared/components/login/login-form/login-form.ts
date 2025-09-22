import { Component, Output, EventEmitter } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password'
import { DividerModule } from 'primeng/divider'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    PasswordModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule
],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
  providers: [MessageService]
})

export class LoginForm {
  @Output() closeDialog = new EventEmitter<void>();

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,

  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {}

  onCancel() {
    this.closeDialog.emit();
  }
}
