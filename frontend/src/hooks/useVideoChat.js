import { useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import { socket } from '../utils/socketManager';

const useVideoChat = () => {
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // Helper function to request microphone and camera access.
  const requestMedia = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  // Initialize socket? connection and optionally request media on mount.
  useEffect(() => {

    // Listen for incoming call events.
    socket?.on('calluser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });

    // Optionally request media permissions immediately on mount.
    // Comment out if you want to request only on call.
    // requestMedia();

    // Cleanup on unmount.
    return () => socket?.disconnect();
  }, []);

  // Answer an incoming call.
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket?.emit('answercall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  // Initiate a call to a given user ID.
  const callUser = async (name, to, from) => {
    // Check if media permissions have been granted; if not, request them.
    if (!stream) {
      await requestMedia();
    }

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket?.emit('calluser', { signalData: data, name, to, from });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket?.on('answercall', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // End the call and clean up the connection.
  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    // Optionally perform additional cleanup (e.g., resetting state)
    window.location.reload();
  };

  return {
    stream,
    // me,
    call,
    callAccepted,
    callEnded,
    // name,
    // setName,
    myVideo,
    userVideo,
    answerCall,
    callUser,
    leaveCall,
    requestMedia, // Exposing this function allows you to manually trigger media permission requests if needed.
  };
};

export default useVideoChat;
