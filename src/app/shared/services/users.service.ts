import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Users } from 'src/app/shared/interface/users';
import { Cacheable } from 'ts-cacheable';

const cacheBuster$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _http: HttpClient) {}

  dataUser: Users[] | undefined ;

  @Cacheable({ cacheBusterObserver: cacheBuster$, maxAge: 60 * 5 * 1000 })
  geUsers(): Observable<Users[]> {
    
    //console.log("UsersService | geUsers");
    const response = this._http.get<any>('http://localhost:3000/users');
    //console.log("UsersService | geUsers / response : ", response);
    return response;
  }

  deleteCached() {
    //console.log("UsersService - deleteCached / Suppression du cache.");
    cacheBuster$.next();// Supprime le cache.
    return true;
  }
}
