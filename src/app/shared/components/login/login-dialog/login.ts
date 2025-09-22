import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { LoginForm } from "../login-form/login-form";

@Component({
  selector: 'app-login',
  imports: [
    DialogModule,
    ButtonModule,
    LoginForm
],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  @Output() loginCompleted = new EventEmitter<void>();

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  onLoginSuccess() {
    this.closeDialog();
    this.loginCompleted.emit();
  }
}
