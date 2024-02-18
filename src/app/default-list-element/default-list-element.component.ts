import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../shared/interfaces/post";
import {restService} from "../../services/restService";


@Component({
  selector: 'app-default-list-element',
  templateUrl: './default-list-element.component.html',
  styleUrls: ['./default-list-element.component.scss']
})
export class DefaultListElementComponent implements OnInit{
  @Input() post!: Post;
  imageUrl: string = "http://localhost:9090/file/download/"
  defaultId: string = "65aee626fb7cfd511db055ee"
  str: string = "";
  count: number = 0;

  constructor( private restService: restService) {}

  ngOnInit(): void {

  }

  saveComment(){
    this.post.comments.push(this.str);
    this.restService.saveComment(this.post);
    this.str = "";
  }

  getImageUri(): string{
    if (this.post.imageId === null || this.post.imageId === ''){
      return this.imageUrl + this.defaultId;
    }
    return this.imageUrl + this.post.imageId;
  }

  incrementCount() {
    this.count++;
  }

  decrementCount() {
    if (this.count > 0) {
      this.count--;
    }
  }


}
