import { Component, inject } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { Register } from '../../components/register/register-dialog/register';
import { DialogService } from '../../../core/services/dialog';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrl: './header.scss',
    standalone: true,
    imports: [
    Menubar,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    Register,
    RouterModule
]
})
export class Header {
  private dialogService = inject(DialogService);

  openDialog(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      return;
    }
    this.dialogService.openLogin();
  }
}