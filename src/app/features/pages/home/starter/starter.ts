import { Component } from '@angular/core';
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

}
