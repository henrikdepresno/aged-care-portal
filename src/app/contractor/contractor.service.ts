import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  constructor() { }

  getContractorId(): string {
    const id = "A123B";
    return id;
  }
}
