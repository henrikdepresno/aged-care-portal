import { QuerySnapshot } from '@angular/fire/firestore';

/** Capitalize every letter in a string */
export function capitalize(str: string) {
  let newStr = ''
  if(str.includes(" ")){
    let strArray = str.split(" ");
    for(let i = 0; i < strArray.length; i++) {
      strArray[i] = strArray[i].charAt(0).toUpperCase() + strArray[i].toLowerCase().slice(1);
      if(i == strArray.length - 1) {
        newStr += strArray[i];
      }
      else {
        newStr += strArray[i] + " ";
      }
    }
  }
  return newStr;
}

/** Get a random ID which is unique from all IDs in the firestore database */
export function randomUniqueID(idSnapshot: QuerySnapshot<any>) {
  let existedIDs: string[] = [];
  const idSnapshotArray = idSnapshot.docs;
  for(let i = 0; i < idSnapshotArray.length; i++) {
    existedIDs.push(idSnapshotArray[i].id);
  }
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let newID = "";
  do {
    newID = "";
    for(let i = 0; i < 5; i++) {
      var randomChar = chars.charAt(Math.floor(Math.random() * 36));
      newID += randomChar;
    }
  } while (existedIDs.includes(newID));
  return newID;
}

/** Get a random 8-digit password */
export function randomPassword() {
  let password = "";
  for(let i = 0; i < 8; i++) {
    var randomDigit = Math.floor(Math.random() * 10);
    password += randomDigit.toString();
  }
  return password;
}

/** Check if a string is numerical */
export function isNumeric(string: string) {
  return (/^\d+$/).test(string);
}

/** Check if a string is an email */
export function isEmail(string: string) {
  return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(string);
}

