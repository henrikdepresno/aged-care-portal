import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private authService: AuthService
  ) { }

  // Click the brand name to navigate back to the homepage
  clickHome() {
    // 'false' is used - not initializing from the Login Component
    this.authService.navigateToHome(false);
  }
}
