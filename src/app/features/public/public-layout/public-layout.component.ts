import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { IntroLoaderComponent } from '../intro-loader/intro-loader.component';
import { FabComponent } from '../fab/fab.component';
import { ToastHostComponent } from '../../../shared/toast-host/toast-host.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, IntroLoaderComponent, FabComponent, ToastHostComponent],
  template: `
    <app-intro-loader></app-intro-loader>
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-fab></app-fab>
    <app-toast-host></app-toast-host>
  `
})
export class PublicLayoutComponent implements OnInit {
  ngOnInit() {
    setTimeout(() => document.body.classList.add('loaded'), 3500);
  }
}
