import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Post, PostFilterSortModel} from '../../models/post';
import {PostsService} from '../../services/post/posts.service';
import {MessageService} from '../../services/message/message.service';
import {UserService} from '../../services/user/user.service';
import {prepareImage} from '../../restConfig';
import {Subscription} from 'rxjs';
import {Filter, Sort, SortFilterMessage} from '../filter/filter.component';

export interface FilterSortMessage {
  ordering: string;
  sorting: {created_after: string, created_before: string};
}

@Component({
  selector: 'app-posts-homepage-section',
  templateUrl: './posts-homepage-section.component.html',
  styleUrls: ['./posts-homepage-section.component.css']
})
export class PostsHomepageSectionComponent implements OnInit, OnDestroy {
  @Output()
  componentLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  posts: Post[] = [];

  postsLoaded = false;

  message: string;

  @Input()
  userID: string;

  messageSubscription: Subscription;
  messageFilterSubscription: Subscription;

  sortFilterMessage: PostFilterSortModel = {};

  constructor(private postService: PostsService,
              private messageService: MessageService,
              private userService: UserService) {
    this.messageFilterSubscription = this.messageService.getSortFilterMessage()
      .subscribe((message: SortFilterMessage) => {
        if (message.isPost) {
          if (message.sort) {
            // sortowanie
            this.posts = [];
            this.sortFilterMessage.ordering = message.sort.dir === 1 ? message.sort.id : '-'.concat(message.sort.id);
            this.listFollowedPosts(null, this.sortFilterMessage);
          } else if (message.filter) {
            this.posts = [];
            this.sortFilterMessage.created_after = message.filter.created_after;
            this.sortFilterMessage.created_before = message.filter.created_before;
            this.listFollowedPosts(null, this.sortFilterMessage);
          } else {
            this.posts = [];
            if (message.likesSort.likes__gt != null) {
              if (message.likesSort.likesGtClicked) {
                this.sortFilterMessage.likes__gt = message.likesSort.likes__gt;
              } else {
                delete this.sortFilterMessage.likes__gt;
              }
            } else {delete this.sortFilterMessage.likes__gt; }
            if (message.likesSort.likes__lt != null) {
              if (message.likesSort.likesLtClicked) {
                this.sortFilterMessage.likes__lt = message.likesSort.likes__lt;
              } else {
                delete this.sortFilterMessage.likes__lt;
              }
            } else {delete this.sortFilterMessage.likes__lt; }
            this.listFollowedPosts(null, this.sortFilterMessage);
          }
        }
      });

    this.messageSubscription = this.messageService.getMessage()
      .subscribe(message => {
        if (message === 'reset_filter_true') {
          this.sortFilterMessage = {};
          this.posts = [];
          this.listFollowedPosts(null,  this.sortFilterMessage);
        }
      });
  }

  ngOnInit(): void {
    this.listFollowedPosts();
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
    this.messageFilterSubscription.unsubscribe();
  }

  onPostDeleted(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

  listFollowedPosts(offset?: number, filters?: PostFilterSortModel): void {
    this.userService.listFollowedPosts(offset, filters)
      .subscribe((posts: Post[]) => {
        if (!offset) {
          this.componentLoaded.emit(true);
          this.postsLoaded = true;
          this.messageService.updateMessage('posts loaded');
        }
        posts.forEach(post => {
          post.user.meta.avatar = prepareImage(post.user.meta.avatar);
          post.image = prepareImage(post.image);

        });
        this.posts = this.posts.concat(posts);

      });
  }

  onScrolled() {
    this.listFollowedPosts(this.posts.length, this.sortFilterMessage);
  }

}
