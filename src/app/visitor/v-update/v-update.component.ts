import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-v-update',
  templateUrl: './v-update.component.html',
  styleUrls: ['./v-update.component.scss']
})
export class V_UpdateComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'update']);
  }

}
