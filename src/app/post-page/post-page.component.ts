import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../shared/interfaces/post";
import {FormBuilder, Validators} from "@angular/forms";
import {restService} from "../../services/restService";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit{
  posts: Post[] = [];
  public createPostForm: any;
  public showCreation: boolean = false;
  responsePost: any;
  @Output() toggleButtonClickEvent = new EventEmitter();

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private restService: restService) {}

  toggleButtonClicked() {
    this.showCreation = !this.showCreation;
  }
  ngOnInit() {
    this.http.get<Post[]>('http://localhost:8080/post').subscribe(data => {
      this.posts = data;
    });
    this.createPostForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [""],
      link: ['', Validators.required],
      imageId: [""],
      username: ["TestUser"],
      comments: [[]]
    })
  }

  onSubmit() {
    console.log("Submit pressed");
    if (this.createPostForm.value.link) {
      this.restService.downloadAndUploadImage(this.createPostForm.value.link)
        .subscribe(response => {
          this.createPostForm.patchValue({
            imageId: response.imageId
          });
          console.log(this.createPostForm.value);
          this.posts.push(this.createPostForm.value);
          this.restService.savePost(this.createPostForm.value);
        });
    }

  }

}
