import { ElementRef, Injectable } from '@angular/core';
import { doc, Firestore, collection, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {

  constructor(private db: Firestore) { }

  createConnection(stream: MediaStream): RTCPeerConnection {
    let connection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        }
      ]
    });
    stream.getTracks().forEach((track) => {
      connection.addTrack(track, stream);
    })
    return connection;
  }

  async createOffer(connection: RTCPeerConnection) {
    let offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    return connection;
  }

  async sendOffer(connection: RTCPeerConnection, senderEmail: string, email: string) {
    await setDoc(doc(this.db, "calls", email), {
      sdp: connection.localDescription,
      type: 'video-offer',
      sender: senderEmail,
      receiver: email,
      status: 'waiting'
    });
  }

  async handleVideoOffer(offer: any, stream: MediaStream) {
    let description = new RTCSessionDescription(offer.sdp);
    let connection = this.createConnection(stream);
    await connection.setRemoteDescription(description);
    let answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);
    await setDoc(doc(this.db, "calls", offer.sender), {
      sdp: connection.localDescription,
      type: 'video-answer',
      sender: offer.sender,
      receiver: offer.receiver,
      status: 'answered'
    });
  }

  async handleICECandidate(event: any, calleeEmail: string) {
    if (event.candidate) {
      await setDoc(doc(this.db, "calls", calleeEmail), {
        type: 'new-ice-candidate',
        candidate: event.candidate,
      });
    }
  }
  async handleNewICECandidate(data: any, connection: RTCPeerConnection) {
    if (data.candidate) {
      await connection.addIceCandidate(data.candidate);
    }
  }

  handleTrackEvent(remoteVideo: ElementRef) {
    return (event: any) => remoteVideo.nativeElement.srcObject = event.streams[0];
  }

  handleRemoveTrackEvent(remoteVideo: ElementRef) {
    return (event: any) => {
      let stream = remoteVideo.nativeElement.srcObject;
      let trackList = stream.getTracks();
      if (trackList.length == 0) {
        this.closeVideoCall();
      }
    }
  }

  closeVideoCall() {
    window.location.href = "/join";
  }

  handleICEConnectionStateChangeEvent(connection: RTCPeerConnection) {
    return (event: any) => {
      switch (connection.iceConnectionState) {
        case "closed":
        case "failed":
          this.closeVideoCall();
          break;
      }
    }
  }

}
