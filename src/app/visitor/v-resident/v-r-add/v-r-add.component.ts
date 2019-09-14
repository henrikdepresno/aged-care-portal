import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-v-r-add',
  templateUrl: './v-r-add.component.html',
  styleUrls: ['./v-r-add.component.scss']
})
export class V_R_AddComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'resident-add']);
  }

}
