import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { capitalize } from '../../functions';

@Component({
  selector: 'app-v-register',
  templateUrl: './v-register.component.html',
  styleUrls: ['./v-register.component.scss']
})
export class V_RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.navigate(['/register']);

    this.authService.registerVisitor(capitalize("Jacques"), capitalize("Bates"));
  }

}
