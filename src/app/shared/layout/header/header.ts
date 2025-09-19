import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { Register } from '../../components/register/register';
import { Login } from "../../components/login/login";
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
    Login
]
})
export class Header {
}