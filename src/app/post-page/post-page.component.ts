import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../shared/interfaces/post";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {restService} from "../../services/restService";
import {ThemePalette} from "@angular/material/core";
import {MaxSizeValidator} from "@angular-material-components/file-input";

@Component({
    selector: 'app-post-page',
    templateUrl: './post-page.component.html',
    styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
    posts: Post[] = [];
    public createPostForm: any;
    public showCreation: boolean = false;
    responsePost: any;
    color: ThemePalette = 'primary';
    disabled: boolean = false;
    multiple: boolean = false;
    accept!: string;
    fileControl!: FormControl;
    @Output() toggleButtonClickEvent = new EventEmitter();

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private restService: restService) {
    }


    toggleButtonClicked() {
        this.showCreation = !this.showCreation;
    }

    public files: any;
    maxSize = 200;

    ngOnInit() {
        this.http.get<Post[]>('http://localhost:8080/post').subscribe(data => {
            this.posts = data;
        });

        this.fileControl = new FormControl(this.files, [
            Validators.required,
            MaxSizeValidator(this.maxSize * 1024),
        ]);

        this.fileControl.valueChanges.subscribe((files: any) => {
            if (!Array.isArray(files)) {
                this.files = [files];
            } else {
                this.files = files;
            }
        });

        this.createPostForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            description: [""],
            imageId: [""],
            file: this.fileControl,
            username: [""],
            comments: [[]]
        })
    }

    onSubmit() {
        console.log(this.createPostForm.valid)
        if (this.createPostForm.valid) {
            const formData = new FormData();
            formData.append('file', this.createPostForm.get('file').value);
            formData.append('title', this.createPostForm.get('title').value);
            this.restService.uploadImage(formData).subscribe(response => {
                this.createPostForm.patchValue({
                    imageId: response.imageId
                });
                this.posts.push(this.createPostForm.value);
                this.restService.savePost(this.createPostForm.value);
                this.createPostForm.reset();
                this.toggleButtonClicked();
            });
        }
    }
}
