import { Component, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button';
import { RegisterForm } from "../register-form/register-form";
import { Login } from "../../login/login-dialog/login";

@Component({
  selector: 'app-register',
  imports: [
    DialogModule,
    ButtonModule,
    RegisterForm,
    Login
],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  @ViewChild('login') loginComponent!: Login;
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  openLogin() {
    this.loginComponent.showDialog();
  }
}
