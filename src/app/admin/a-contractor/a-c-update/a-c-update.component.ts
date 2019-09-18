import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';

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

    this.loadComponent();
  }

  loadComponent() {
    //load the input fields
  }

  updateContractor(){
    //update firebase

    swal({
      title: "Success!",
      text: "Details updated!",
      icon: "success",
      buttons: {
        ok: "OK"
      }
    } as any)
    .then(() => {

    })
  }

}
