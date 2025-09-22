import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Starter } from "./features/pages/home/starter/starter";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Starter
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mythica');
}
