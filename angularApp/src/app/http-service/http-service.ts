import { Injectable } from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import "rxjs/Rx";
import { map } from "rxjs/operators";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})
export class HttpService {

  constructor(private http:Http) { }

// Returns student list
  public getPublicFeed()
{
  return  this.http.
  //get('http://localhost:8100/flick/').pipe(map((response:Response) =>
  get(environment.apiUrl).pipe(map((response:Response) =>
   (response.json()) )   
    );
}



}