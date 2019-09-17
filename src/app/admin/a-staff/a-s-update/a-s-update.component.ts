import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-a-s-update',
  templateUrl: './a-s-update.component.html',
  styleUrls: ['./a-s-update.component.scss']
})
export class A_S_UpdateComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'staff-update']);
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
