import {Component, HostListener, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user';
import {Follower} from '../../models/follower';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  followed: Follower[];

  user: User;

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  innerWidth: any;

  constructor(private deviceService: DeviceDetectorService,
              private userService: UserService,
              private authService: AuthService) {
    this.innerWidth = window.innerWidth;
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
    this.getLoggedUserData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  async getFollower(id: number): Promise<Follower> {
    return await new Promise<Follower>(resolve =>
      this.userService.getFollower(id)
        .subscribe(follower => {
          resolve(follower);
        }));
  }

  getLoggedUserData() {
    this.userService.getUser(this.authService.userID).subscribe(user => {
      this.user = user;
      const requests = [];
      const followed: Follower[] =  [];
      for (const followedID of this.user.followed) {
        requests.push(
          this.getFollower(followedID).then(follower => {
            followed.push(follower);
          }));
      }

      Promise.all(requests).then(() => {
        this.followed = followed;
        console.log(this.followed)
      });

      }, error => {
      console.log('ERROR WHILE GETTING LOGGED USER DATA FROM HOMEPAGE');
      console.log(error);
    });
  }
}
