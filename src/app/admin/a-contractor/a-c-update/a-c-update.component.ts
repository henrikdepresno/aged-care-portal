import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a-c-update',
  templateUrl: './a-c-update.component.html',
  styleUrls: ['./a-c-update.component.scss']
})
export class A_C_UpdateComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'contractor-update']);
  }

}
