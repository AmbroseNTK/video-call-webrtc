import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit, AfterViewInit {

  constructor() { }

  openedCamera = true;
  openedMic = true;

  mediaStream!: MediaStream;

  @ViewChild('callerVideo') callerVideo!: ElementRef;
  @ViewChild('calleeVideo') calleeVideo!: ElementRef;

  ngOnInit(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    console.log(this.callerVideo.nativeElement);
    await this.getMedia({
      video: true,
      // audio: true
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
