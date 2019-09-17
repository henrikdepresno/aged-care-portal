import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';

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
