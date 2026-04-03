import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CERISoNet');
  isMenuOpen = signal(false);

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  getUserName() {
    return localStorage.getItem('username');
  }

  isLoggedIn() {
    return localStorage.getItem('isConnected') === 'true';
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('isConnected');

    window.location.reload();
  }
}
