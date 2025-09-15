import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  providers: [
    MessageService
  ],
  imports: [
    ButtonModule,
    ToastModule,
    CardModule
  ]
})
export class Header {
  constructor(private messageService: MessageService) {}

  showToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Tema Mythica',
      detail: 'O tema está funcionando!'
    });
  }
}

