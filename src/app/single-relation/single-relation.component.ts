import {AfterContentInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {faEllipsisH, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ImageSnippet} from '../models/imageSnippet';
import {Relation} from '../models/relation';
import {DialogMode} from '../models/dialogMode';
import {AuthService} from '../services/auth/auth.service';
import {RegisterComponent} from '../register/register.component';
import {MessageService} from '../services/message/message.service';
import {OptionsComponent} from '../options/options.component';
import {RelationService} from '../services/relation/relation.service';
import moment from 'moment';

interface DataRelation {
  relation: Relation;
  mode: DialogMode;
}

@Component({
  selector: 'app-single-relation',
  templateUrl: './single-relation.component.html',
  styleUrls: ['./single-relation.component.css']
})
export class SingleRelationComponent implements OnInit, AfterContentInit, OnDestroy {
  mode: DialogMode;
  relation: Relation;
  isOwner: boolean;

  isDesktop: boolean;

  innerWidth: any;
  innerHeight: any;

  closeIcon = faTimes;
  moreIcon = faEllipsisH;

  timeLeft = 100.0;
  interval;

  showRelation = false;

  selectedFile = new ImageSnippet(null, null);

  constructor(public dialogRef: MatDialogRef<SingleRelationComponent>,
              public dialog: MatDialog,
              private deviceService: DeviceDetectorService,
              @Inject(MAT_DIALOG_DATA) public dataRelation: DataRelation,
              private authService: AuthService,
              private relationService: RelationService) {
    this.isDesktop = deviceService.isDesktop();
    this.mode = dataRelation.mode;
    this.relation = dataRelation.relation;

    this.isOwner = this.relation.user.id === this.authService.userID;
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.showRelation = true;
    this.setSize();

    if (this.mode === DialogMode.WATCH) {
      this.startTimer();
    }
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }

  handleClose() {
    this.dialogRef.close();
    clearInterval(this.interval);
  }

  handleAdd() {
    this.dialogRef.close(this.selectedFile.file);
  }

  handleOptionsClick() {
    clearInterval(this.interval);
    const optionsDialogRef = this.dialog.open(OptionsComponent, {
      autoFocus: false
    });

    optionsDialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.relationService.removeRelation(this.relation.id)
          .subscribe(res => this.dialogRef.close('deleted'));
      } else {
        this.startTimer();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize();
  }

  setSize() {
    const options = document.getElementById('s-relation-header-options').clientHeight;
    const header = document.getElementById('s-relation-header').clientHeight;

    const width = window.innerWidth;
    const height = window.innerHeight - options - header;

    this.innerWidth = this.isDesktop ? width / 2.0 : width * 0.95;
    this.innerHeight = this.isDesktop ? height * 0.7 : height * 0.5;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft -= 5;
      } else {
        this.handleClose();
      }
    }, 150);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
