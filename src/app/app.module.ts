import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { TruncateModule } from '@yellowspot/ng-truncate';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import {DeviceDetectorModule, DeviceDetectorService} from 'ngx-device-detector';
import {MatMenuModule} from '@angular/material/menu';
import { LoginComponent } from './components/login/login.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RegisterComponent } from './components/register/register.component';
import {RouterModule, Routes} from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import {AuthGuard, AuthInterceptor, AuthService} from './services/auth/auth.service';
import { ForgotComponent } from './components/forgot/forgot.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PostDetailComponent } from './components/post-detail/post-detail-component';
import { RelationDetailComponent } from './components/relation-detail/relation-detail-component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { OptionsComponent } from './components/options/options.component';
import { ResetComponent } from './components/reset/reset.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from './components/filter/filter.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { RelationsModalContainerComponent } from './components/relations-modal-container/relations-modal-container.component';
import { RelationsHomepageSectionComponent } from './components/relations-homepage-section/relations-homepage-section.component';
import { PostsHomepageSectionComponent } from './components/posts-homepage-section/posts-homepage-section.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

const appRoutes: Routes = [
  {
    path: 'relations/:id',
    component: RelationsModalContainerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot',
    component: ForgotComponent
  },
  {
    path: 'reset/:token',
    component: ResetComponent
  },
  {
    path: 'edit/:id',
    component: EditPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    component: ProfileComponent
  },
  {
    path: 'post/:id',
    component: PostDetailComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'add',
    component: AddPostComponent,
    canActivate: [AuthGuard]
  },
  { path: 'not-found',
    component: PageNotFoundComponent
  },
  { path: 'forbidden',
    component: ForbiddenComponent
  },
  { path: '',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ProfileComponent,
    HomepageComponent,
    AddPostComponent,
    ForgotComponent,
    PostDetailComponent,
    RelationDetailComponent,
    OptionsComponent,
    ResetComponent,
    FilterComponent,
    EditPostComponent,
    RelationsModalContainerComponent,
    RelationsHomepageSectionComponent,
    PostsHomepageSectionComponent,
    ProfileEditComponent,
    ForbiddenComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      /*{ enableTracing: true } // <-- debugging purposes only*/
    ),
    BrowserModule,
    TruncateModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm', 'gt-xs']
    }),
    ScrollingModule,
    MatInputModule,
    FormsModule,
    DeviceDetectorModule.forRoot(),
    MatMenuModule,
    MatDialogModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    MatExpansionModule,
    NgbCollapseModule,
    MatBottomSheetModule,
    MatListModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  providers: [ AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
