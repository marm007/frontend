import {Component, HostListener} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user';
import {Follower} from '../../models/follower';
import {AuthService} from '../../services/auth/auth.service';
import {ImageType, prepareImage} from '../../restConfig';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  followed: Follower[];

  user: User;

  componentLoaded = false;

  innerWidth: any;

  constructor(private userService: UserService,
              private authService: AuthService) {
    this.innerWidth = window.innerWidth;
    this.getLoggedUserData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  onComponentLoaded() {
    this.componentLoaded = true;
  }

  getFollower(id: number): Observable<Follower> {
      return this.userService.getFollower(id);
  }

  getLoggedUserData() {
    this.userService.get(this.authService.userID).subscribe(user => {
      user.meta.avatar = prepareImage(user.meta.avatar, ImageType.THUMBNAIL);
      this.user = user;
      const requests = [];
      for (const followedID of this.user.followed) {
        requests.push(
          this.getFollower(followedID));
      }

      forkJoin(requests)
        .subscribe((followed: Follower[]) => {
          this.followed = followed;
        });
    });
  }
}
