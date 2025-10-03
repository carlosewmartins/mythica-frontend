import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button';
import { RegisterForm } from "../register-form/register-form";

@Component({
  selector: 'app-register',
  imports: [
    DialogModule,
    ButtonModule,
    RegisterForm
],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}
