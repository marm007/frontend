import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Relation} from '../../models/relation';
import {UserFull} from '../../models/user';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8000/api/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public getLoggedUserData(): Observable<UserFull> {
    const id = this.authService.userID;
    return this.http.get<UserFull>(this.url.concat('users/').concat(String(id)).concat('/'));
  }

  public getUser(id: number): Observable<UserFull> {
    return this.http.get<UserFull>(this.url.concat('users/').concat(String(id)).concat('/'));
  }
}
