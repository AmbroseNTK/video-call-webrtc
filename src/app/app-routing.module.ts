import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinMeetingComponent } from './components/join-meeting/join-meeting.component';
import { MeetingComponent } from './components/meeting/meeting.component';

const routes: Routes = [
  {
    path: 'meeting',
    component: MeetingComponent,
  },
  {
    path: 'join',
    component: JoinMeetingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
