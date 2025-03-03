import React, { useEffect } from 'react';
import useVideoChat from '../hooks/useVideoChat';

const VideoPlayer = ({ targetUserId, }) => {
    const {
        stream,
        call,
        callAccepted,
        callEnded,
        name,
        setName,
        myVideo,
        userVideo,
        answerCall,
        callUser,
        leaveCall,
        requestMedia,
    } = useVideoChat();
    console.log(callAccepted, call);

    useEffect(() => {
        // For example, request media when user clicks "Call"
        // or you can trigger it on mount by uncommenting requestMedia in the hook.
        requestMedia();
    }, []);

    return (
        <div style={{ color: 'white' }}>
            <h2>Your ID:</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
            />
            <div>
                <video ref={myVideo} autoPlay muted style={{ width: '300px' }} />
                {callAccepted && !callEnded && (
                    <video ref={userVideo} autoPlay muted style={{ width: '300px' }} />
                )}
            </div>
            <div>
                {/* Answer incoming call */}
                {call.isReceivedCall && !callAccepted && (
                    <button onClick={answerCall}>Answer Call</button>
                )}
                {/* End call */}
                {callAccepted && (
                    <button onClick={leaveCall}>End Call</button>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
