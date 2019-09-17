import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';

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

  addResident(){

//update firebase

    swal({
      title: "Success!",
      text: "Resident added",
      icon: "success",
      buttons: {
        ok: "OK"
      }
    } as any)

    //if fields are empty

    swal({
      title: "Error!",
      text: "Some fields are empty!",
      icon: "error",
      buttons: {
        ok: "OK"
      }
    } as any)
    
    //return to resident view?
  }

}
