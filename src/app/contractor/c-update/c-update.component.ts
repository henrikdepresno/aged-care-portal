import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { ContractorService } from '../contractor.service';
import QRCode from 'qrcode';
import swal from 'sweetalert';

@Component({
  selector: 'app-c-update',
  templateUrl: './c-update.component.html',
  styleUrls: ['./c-update.component.scss']
})
export class C_UpdateComponent implements OnInit {

  constructor(
    private router: Router,
    private contractorService: ContractorService
  ) { }

  ngOnInit() {
    this.router.navigate(['/contractor', 'update']);

    QRCode.toCanvas(document.getElementById('qrcode'), this.contractorService.getContractorId(), {scale: 9});
  }

  toggleQRCode(toggle: boolean) {
    if(toggle) {
      $('div#qr-container').show();
      $('body').addClass('stop-scrolling');
      $('.stop-scrolling').css({
        "height": "100%",
        "overflow": "hidden"
      });
    } else {
      $('div#qr-container').hide();
      $('.stop-scrolling').css({
        "height": "auto",
        "overflow": "visible"
      });
      $('body').removeClass('stop-scrolling');
    }
  }

  updateDetails(){
        
    //if fields are not filled in
        swal({
          title: "Error!",
          text: "All fields are not filled in!",
          icon: "error",
          buttons: {
            ok: "OK"
          }
        } as any)
      
      // else, add resident to firebase collection
  
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
