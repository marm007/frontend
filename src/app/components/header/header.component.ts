import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth/auth.service';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user';
import {MessageService} from '../../services/message/message.service';
import {Subscription} from 'rxjs';
import {mediaURL} from '../../restConfig';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;

  user: User;
  messageSubscription: Subscription;

  isMobile: boolean;
  isLoggedIn: boolean;

  userList: User[];

  constructor(private deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              private router: Router,
              public authService: AuthService,
              private userService: UserService,
              private messageService: MessageService) {

    this.isMobile = deviceService.isMobile();

    this.isLoggedIn = this.authService.isLoggedIn();

    this.messageSubscription = messageService.getMessage()
      .subscribe(message => {
        if (message === 'logged_in') {
          this.isLoggedIn = true;
          this.getUser();
        }
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
      id: 'login'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'logged_in') {
        this.messageService.updateMessage('logged_in');

      }
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.messageService.updateMessage('logged_out');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = null;
    if (this.router.url === '/') {
      this.router.navigate(['login']);
    }
  }

  getUser() {
    this.userService.get(null, false).subscribe(user => {
        this.user = user;
        this.user.meta.avatar = mediaURL + this.user.meta.avatar.slice(0, 13)
        + 'c_scale,w_50/' + this.user.meta.avatar.slice(13,  this.user.meta.avatar.length);    });
  }

  onSearchChange(searchValue: string): void {
    if (searchValue) {
      this.userService.filter('username__contains', searchValue)
        .subscribe(users => {
          users.forEach(user => {
            user.meta.avatar = mediaURL +  user.meta.avatar.slice(0, 13)
              + 'c_scale,w_50/' + user.meta.avatar.slice(13,  user.meta.avatar.length);    });
          this.userList = users;
        });
    } else { this.userList = []; }
  }

  displayFn(user: User) {
    const u = user ? user.username : user;
    return ''; // u
  }

  // handleUserClick(id) {
  //   this.autocompleteInput.nativeElement.value = '';
  //   this.router.navigate([`profile/${id}`]);
  // }
}
