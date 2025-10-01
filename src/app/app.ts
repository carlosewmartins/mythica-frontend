import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DialogManager } from './shared/components/dialog-manager/dialog-manager';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
    DialogManager
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {  
  protected readonly title = signal('mythica');
}
