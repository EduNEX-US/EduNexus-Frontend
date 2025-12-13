import React, { useEffect, useRef } from "react";
import { socket } from "./socket";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCall({roomId} : {roomId : string}){
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerRef.current = new RTCPeerConnection(ICE_SERVERS);

      stream.getTracks().forEach(track =>
        peerRef.current?.addTrack(track, stream)
      );

      peerRef.current.ontrack = event => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerRef.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };
    };

    initCall();
    socket.emit("join-room", roomId);

    socket.on("user-joined", async () => {
      const offer = await peerRef.current?.createOffer();
      await peerRef.current?.setLocalDescription(offer!);

      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async (offer) => {
      await peerRef.current?.setRemoteDescription(offer);
      const answer = await peerRef.current?.createAnswer();
      await peerRef.current?.setLocalDescription(answer!);

      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await peerRef.current?.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await peerRef.current?.addIceCandidate(candidate);
    });

    return () => {
      socket.disconnect();
      peerRef.current?.close();
    };
  }, [roomId]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <video ref={localVideoRef} autoPlay muted width={300} />
      <video ref={remoteVideoRef} autoPlay width={300} />
    </div>
  );
};

