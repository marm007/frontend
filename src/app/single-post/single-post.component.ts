import {Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output} from '@angular/core';
import {Post} from '../models/post';
import {ActivatedRoute, Router} from '@angular/router';
import {PostsService} from '../services/post/posts.service';
import {CommentService} from '../services/comment/comment.service';
import {Comment} from '../models/comment';
import {faEllipsisH, faHeart} from '@fortawesome/free-solid-svg-icons';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../services/auth/auth.service';
import {Like} from '../models/like';
import {MessageService} from '../services/message/message.service';

@Component({
  selector: 'app-single-post',
  animations: [
    trigger('like', [
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('3000ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('3000ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
  ],
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  @Output()
  postDeleted: EventEmitter<Post> = new EventEmitter<Post>();

  @Input()
  post: Post;
  @Input()
  userID: number;

  @HostBinding('@like')
  public likeTrigger = false;

  moreIcon = faEllipsisH;
  likeIcon = faHeart;

  isPostOwner: boolean;
  addPaddingToTop: boolean;

  showDescription = false;
  showMoreComments = false;

  addCommentContent: string;


  apiRoot = 'http://127.0.0.1:8000';

  constructor(private activatedRoute: ActivatedRoute,
              private postsService: PostsService,
              private commentService: CommentService,
              private authService: AuthService,
              private router: Router) {
  }

  handleDelete() {
    this.postsService.deletePost(String(this.post.id)).subscribe(res => {
      console.log('LOG FROM DELETE POST FROM POST');
      console.log(res);
      console.log( this.router.url);
      if (res === null) {
        if (this.router.url === '/') {
          this.postDeleted.emit(this.post);
        }
        this.router.navigate(['']);
      }
    });
  }

  handleSee() {
    this.router.navigate(['/post/'.concat(String(this.post.id))]);
  }

  ngOnInit() {

    if (this.userID === undefined) {
      this.userID = this.authService.userID;
    }

    if (this.post == null) {
      this.addPaddingToTop = true;
      this.activatedRoute.params.subscribe(params => {
        this.getPost(params.id);
      });
    } else {
      console.log(this.post);
      this.isPostOwner = this.post.user.id === this.authService.userID;
      this.addPaddingToTop = false;
      this.post.image = this.apiRoot + this.post.image;
      this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
    }

  }

  get isLiked(): boolean {
    return this.post.liked.some(like => like.user_id === this.userID);
  }

  handleClick(buttonClicked?: boolean) {
    if (this.likeTrigger === false && buttonClicked !== true) {
      this.likeTrigger = true;
      this.likePost(String(this.post.id), buttonClicked);
      setTimeout(() => this.likeTrigger = false, 800);
    } else {
      this.likePost(String(this.post.id), buttonClicked);
    }
  }

  getPost(id: string) {
    this.postsService.getPost(id).subscribe(post => {
      if (post !== null) {
        this.post = post;
        console.log(this.post);
        this.isPostOwner = this.post.user.id === this.authService.userID;
        this.post.image = this.apiRoot + this.post.image;
        this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
      } else { this.router.navigate(['not-found']); }
    });
  }

  likePost(id: string, buttonClicked?: boolean) {
    if (buttonClicked !== true) {
      if (!this.isLiked) {
        this.postsService.likePost(id).subscribe(post => {
          if (post !== null) {
            this.post = post;
            this.post.image = this.apiRoot + this.post.image;
            this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
          } else {

          }
        });
      }
    } else {
      this.postsService.likePost(id).subscribe(post => {
        if (post !== null) {
          this.post = post;
          this.post.image = this.apiRoot + this.post.image;
          this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
        } else {

        }
      });
    }

  }

  addComment(commentText: string): void {
    const comment = {body: commentText, photo_id: this.post.id, author_name: this.post.user.username};
    this.commentService.addComment(comment).subscribe(c => {
      const commentAdded = {body: c.body, author_name: c.author_name};
      this.post.comments.push(commentAdded as Comment);
      this.addCommentContent = '';
    });
  }
}
