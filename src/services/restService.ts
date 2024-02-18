import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Post} from "../app/shared/interfaces/post";
import {FormBuilder} from "@angular/forms";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class restService {

  constructor(private http: HttpClient) { }


  public savePost(post: Post){
    this.http.post<Post>('http://localhost:8080/post/create', post).subscribe();
  }
  public saveComment(post: Post){
    const id = post.id;
    this.http.put<Post>('http://localhost:8080/post/update/'+id, post).subscribe();
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8080/file/upload', formData);
  }

}
