import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import apiRoot from '../../rest-config';
import {AuthService} from '../auth/auth.service';
import {Post} from '../../models/post';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiRoot = 'http://localhost:8000/api/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public uploadImage(image: File, description: string): Observable<Post> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    return this.http.post<Post>(this.apiRoot.concat('photos/'), formData, {headers: this.authService.jwtAuthHeaders});
  }
}
