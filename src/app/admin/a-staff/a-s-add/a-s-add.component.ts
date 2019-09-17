import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';

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

  addStaff(){

    //update firebase
    
    swal({
      title: "Success!",
      text: "Staff added",
      icon: "success",
      buttons: {
        ok: "OK"
      }
    } as any)

    //if some fields are empty

    swal({
      title: "Error!",
      text: "Some fields are empty!",
      icon: "error",
      buttons: {
        ok: "OK"
      }
    } as any)

    //return to staff view?
  }

}
