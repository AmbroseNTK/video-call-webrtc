import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, private auth: Auth, private router: Router) { }

  openedCamera = true;
  openedMic = true;

  mediaStream!: MediaStream;

  calleeEmail: string = "";
  caller!: User | null;

  @ViewChild('callerVideo') callerVideo!: ElementRef;
  @ViewChild('calleeVideo') calleeVideo!: ElementRef;

  ngOnInit(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getMedia({
      video: true,
      // audio: true
    });
    this.route.queryParams.subscribe(params => {
      this.calleeEmail = params['email'];
      console.log(this.calleeEmail);
      if (this.calleeEmail == "") {
        this.router.navigate(['/join']);
        this.closeCamera();
      }
    })
    authState(this.auth).subscribe(user => {
      if (user) {
        this.caller = user;
      }
      else {
        this.router.navigate(['/join']);
        this.closeCamera();
      }
    });
  }

  async getMedia(constraints: any) {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaStream = stream;
      /* use the stream */
      if (this.callerVideo) {
        this.callerVideo.nativeElement.srcObject = stream;
        this.callerVideo.nativeElement.onloadeddata = () => {
          this.callerVideo.nativeElement.play();
          this.calleeVideo.nativeElement.muted = true;
        }
      }
    } catch (err) {
      /* handle the error */
      console.log(err);
    }
  }

  openCamera() {
    // Show camera
    this.mediaStream.getVideoTracks()[0].enabled = true;
    this.openedCamera = true;
  }

  closeCamera() {
    this.mediaStream.getVideoTracks()[0].enabled = false;
    this.openedCamera = false;
  }

}
