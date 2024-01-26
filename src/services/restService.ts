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

  public getImageWithId(imageId: string){
    this.http.get<any>('http://localhost:8080/file/download/'+imageId).subscribe();
  }

  public downloadAndUploadImage(url: string): Observable<any> {
    return new Observable(observer => {
      this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
        this.uploadImage(blob).subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => observer.error(error)
        );
      }, error => observer.error(error));
    });
  }

  private uploadImage(blob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', blob);

    // Replace with your API endpoint
    const uploadUrl = 'http://localhost:8080/file/upload';
    return this.http.post(uploadUrl, formData);
  }

}
