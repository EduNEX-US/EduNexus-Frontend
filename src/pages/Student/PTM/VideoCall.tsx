import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import Controls from "./Controls.tsx";
import Chat from "./Chat.tsx";

// const ICE_SERVERS = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// const VideoCall = ({ roomId }: { roomId: string }) => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);

//   const peerRef = useRef<RTCPeerConnection | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);

//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);

//   useEffect(() => {
//     const startCall = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       localStreamRef.current = stream;

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       peerRef.current = new RTCPeerConnection(ICE_SERVERS);

//       stream.getTracks().forEach(track =>
//         peerRef.current?.addTrack(track, stream)
//       );

//       peerRef.current.ontrack = e => {
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = e.streams[0];
//         }
//       };

//       peerRef.current.onicecandidate = e => {
//         if (e.candidate) {
//           socket.emit("ice-candidate", {
//             roomId,
//             candidate: e.candidate,
//           });
//         }
//       };
//     };

//     startCall();
//     socket.emit("join-room", roomId);

//     socket.on("user-joined", async () => {
//       const offer = await peerRef.current?.createOffer();
//       await peerRef.current?.setLocalDescription(offer!);
//       socket.emit("offer", { roomId, offer });
//     });

//     socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
//       await peerRef.current?.setRemoteDescription(offer);
//       const answer = await peerRef.current?.createAnswer();
//       await peerRef.current?.setLocalDescription(answer!);
//       socket.emit("answer", { roomId, answer });
//     });

//     socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
//       await peerRef.current?.setRemoteDescription(answer);
//     });

//     socket.on("ice-candidate", async (candidate: RTCIceCandidate) => {
//       await peerRef.current?.addIceCandidate(candidate);
//     });

//     return () => {
//       peerRef.current?.close();
//       socket.disconnect();
//     };
//   }, [roomId]);

//   const toggleMic = () => {
//     const audioTrack = localStreamRef.current?.getAudioTracks()[0];
//     if (!audioTrack) return;
//     audioTrack.enabled = !audioTrack.enabled;
//     setMicOn(audioTrack.enabled);
//   };

//   const toggleCamera = () => {
//     const videoTrack = localStreamRef.current?.getVideoTracks()[0];
//     if (!videoTrack) return;
//     videoTrack.enabled = !videoTrack.enabled;
//     setCamOn(videoTrack.enabled);
//   };

//   const shareScreen = async () => {
//     const screenStream = await navigator.mediaDevices.getDisplayMedia({
//       video: true,
//     });

//     const screenTrack = screenStream.getVideoTracks()[0];
//     const sender = peerRef.current
//       ?.getSenders()
//       .find(s => s.track?.kind === "video");

//     sender?.replaceTrack(screenTrack);

//     screenTrack.onended = () => {
//       const camTrack = localStreamRef.current?.getVideoTracks()[0];
//       sender?.replaceTrack(camTrack!);
//     };
//   };

//   return (
//     <div className="w-full">
//       <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
//   <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden">
//     <video
//       ref={remoteVideoRef}
//       className="w-full h-full object-cover"
//       autoPlay
//       playsInline
//     />

//     <div className="absolute bottom-4 right-4 w-40 aspect-video bg-black rounded-lg overflow-hidden border border-white">
//       <video
//         ref={localVideoRef}
//         className="w-full h-full object-cover"
//         autoPlay
//         muted
//         playsInline
//       />
//     </div>
//   </div>
// </div>


//       <Controls
//         micOn={micOn}
//         camOn={camOn}
//         toggleMic={toggleMic}
//         toggleCamera={toggleCamera}
//         shareScreen={shareScreen}
//       />

//       <Chat roomId={roomId} />
//     </div>
//   );
// };

// export default VideoCall;
