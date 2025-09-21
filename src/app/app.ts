import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Starter } from "./features/pages/home/starter/starter";
import { RegisterForm } from "./shared/components/register/register-form/register-form";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Starter,
    RegisterForm
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mythica');
}
