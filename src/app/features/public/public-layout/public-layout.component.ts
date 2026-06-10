import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, IntroLoaderComponent, FabComponent, ToastHostComponent],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent implements OnInit {
  ngOnInit() {
    setTimeout(() => document.body.classList.add('loaded'), 3500);
  }
}
