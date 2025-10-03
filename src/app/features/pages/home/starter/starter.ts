import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Header } from '../../../../shared/layout/header/header';
@Component({
  selector: 'app-starter',
  imports: [
    ButtonModule,
    Header
  ],
  templateUrl: './starter.html',
  styleUrl: './starter.scss'
})
export class Starter {
  private router = inject(Router);

  navigateToCharacters() {
    this.router.navigate(['/personagens']);
  }

  navigateToCampaigns() {
    this.router.navigate(['/campanhas']);
  }
}
