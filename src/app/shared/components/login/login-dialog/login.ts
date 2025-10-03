import { Component, Output, EventEmitter, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { LoginForm } from "../login-form/login-form";
import { Register } from "../../register/register-dialog/register";

@Component({
  selector: 'app-login',
  imports: [
    DialogModule,
    ButtonModule,
    LoginForm,
    Register
],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private router = inject(Router);

  @ViewChild('register') registerComponent!: Register;
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
    this.router.navigate(['/personagens']);
  }

  openRegister() {
    this.registerComponent.showDialog();
  }
}
