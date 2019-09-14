import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a-s-add',
  templateUrl: './a-s-add.component.html',
  styleUrls: ['./a-s-add.component.scss']
})
export class A_S_AddComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'staff-add']);
  }

}
