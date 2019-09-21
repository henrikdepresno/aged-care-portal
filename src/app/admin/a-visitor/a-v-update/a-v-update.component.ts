import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { AdminService } from '../../admin.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-a-v-update',
  templateUrl: './a-v-update.component.html',
  styleUrls: ['./a-v-update.component.scss']
})
export class A_V_UpdateComponent implements OnInit {

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'visitor-update']);

    const flags = this.adminService.getFlags();
    for(let i = 1; i <= 3; i++) {
      const flag = flags[i - 1];
      const date = flag.date;
      const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
        + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
        + date.getFullYear();
      $('p#date-' + i).text(dateStr);
      $('p#staff-' + i).text(flag.staff);
      $('span#view-' + i).show();
      $('span#view-' + i).click(() => {
        this.viewFlag();
      });
    }
  }

  viewFlag() {
    
  }

  updateDetails(){
        
    //update firebase

    swal({
      title: "Success!",
      text: "Details updated",
      icon: "success",
      buttons: {
        ok: "OK"
      }
    } as any)
  }

}
