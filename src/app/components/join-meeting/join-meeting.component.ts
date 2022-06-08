import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup, signOut, User } from '@firebase/auth';
@Component({
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.scss']
})
export class JoinMeetingComponent implements OnInit {

  constructor(private auth: Auth, private router: Router) { }

  user?: User | null;
  email: string = "";

  ngOnInit(): void {
    authState(this.auth).subscribe(user => {
      this.user = user;
      if (user) {
        console.log(user);
      }
    });
  }

  async login() {
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
    }
    catch {
      console.log("error");
    }
  }

  async logout() {
    await signOut(this.auth);
  }

  call() {
    this.router.navigate(['/meeting'], { queryParams: { email: this.email } });
  }

}
