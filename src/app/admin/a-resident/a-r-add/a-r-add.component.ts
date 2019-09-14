import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a-r-add',
  templateUrl: './a-r-add.component.html',
  styleUrls: ['./a-r-add.component.scss']
})
export class A_R_AddComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'resident-add']);
  }

}
