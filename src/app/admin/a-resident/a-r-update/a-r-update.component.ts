import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a-r-update',
  templateUrl: './a-r-update.component.html',
  styleUrls: ['./a-r-update.component.scss']
})
export class A_R_UpdateComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'resident-update']);
  }

}
