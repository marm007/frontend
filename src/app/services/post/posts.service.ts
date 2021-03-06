import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Post} from '../../models/post';
import {catchError, map, retry, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import handleError from '../errorHandler';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  add(image: File, description: string): Observable<Post> {
    const url = `${environment.apiURL}/posts/`;
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    return this.http.post<Post>(url, formData,
      {headers: this.authService.jwtAuthHeaders}).pipe(
        retry(2)
    );
  }

  get(id: number): Observable<Post> {
    const url = `${environment.apiURL}/posts/${id}/`;
    return this.http.get<Post>(url,
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`fetched post id=${id}`)),
      );
  }

  like(id: string): Observable<Post> {
    const url = `${environment.apiURL}/posts/${id}/like/`;
    return this.http.patch<Post>(url,
      null, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`liked post id=${id}`)),
        catchError(handleError<Post>('likePost'))
      );
  }

  delete(id: string): Observable<any> {
    const url = `${environment.apiURL}/posts/${id}/`;
    return this.http.delete<any>(url,
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`deleted post id=${id}`)),
        catchError(handleError<any>('deletePost'))
      );
  }

  update(id: string, description: string, image: File): Observable<Post> {
    const url = `${environment.apiURL}/posts/${id}/`;
    const formData = new FormData();

    if (description && image) {
      formData.append('description', description);
      formData.append('image', image);
      return this.http.put<Post>(url, formData,
        {headers: this.authService.jwtAuthHeaders})
        .pipe(
          retry(2),
          tap(_ => console.log(`updated post id=${id}`)),
          catchError(handleError<Post>('updatePost'))
        );
    } else {
      if (image) {
        formData.append('image', image);

      } else if (description) {
        formData.append('description', description);
      }

      return this.http.patch<Post>(url, formData,
        {headers: this.authService.jwtAuthHeaders})
        .pipe(
          retry(2),
          tap(_ => console.log(`updated post id=${id}`)),
          catchError(handleError<Post>('updatePost'))
        );
    }

  }
}
