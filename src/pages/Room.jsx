import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'peerjs';

function Room() {
    const { roomId } = useParams();
    const [peerId, setPeerId] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [peer, setPeer] = useState(null);

    useEffect(() => {
        // Create Peer instance with custom signaling server
        const newPeer = new Peer(undefined, {
            host: 'peerconnect-tau.vercel.app/',
            secure: true,
            port: 443,
            path: '/'
          });

        setPeer(newPeer);

        newPeer.on('open', (id) => {
            setPeerId(id);
            console.log('My Peer ID:', id);
            console.log('Calling peer ID:', roomId);
            setIsLoading(false);
        });

        newPeer.on('error', (err) => {
            console.error('PeerJS Error:', err);
            setIsLoading(false);
        });

        newPeer.on('call', async (incomingCall) => {
            console.log('Incoming call from:', incomingCall.peer);

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideoRef.current.srcObject = stream;
                incomingCall.answer(stream);

                incomingCall.on('stream', (remoteStream) => {
                    console.log('Received remote stream');
                    remoteVideoRef.current.srcObject = remoteStream;
                    setIsCalling(true);
                });

                incomingCall.on('error', (err) => {
                    console.error('Call error:', err);
                });
            } catch (err) {
                console.error('Error accessing media devices:', err);
            }
        });

        return () => {
            if (newPeer) {
                newPeer.destroy();
            }
            if (localVideoRef.current?.srcObject) {
                localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const handleStartCall = async () => {
        if (!peer || !roomId) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = stream;

            const call = peer.call(roomId, stream);

            call.on('stream', (remoteStream) => {
                console.log('Connected to peer:', call.peer);
                remoteVideoRef.current.srcObject = remoteStream;
                setIsCalling(true);
                setIsLoading(false);
            });

            call.on('error', (err) => {
                console.error('Call Error:', err);
                setIsLoading(false);
            });
        } catch (err) {
            console.error('Failed to get local stream:', err);
            setIsLoading(false);
        }
    };

    const handleEndCall = () => {
        if (peer) {
            peer.disconnect();
            setIsCalling(false);
            setIsLoading(false);
            if (localVideoRef.current?.srcObject) {
                localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
            console.log('Call ended');
        }
    };

    return (
        <div>
            <h2>Room: {roomId}</h2>
            <div className="video-container">
                <video ref={localVideoRef} autoPlay muted width="400" height="300"></video>
                <video ref={remoteVideoRef} autoPlay width="400" height="300"></video>
            </div>

            <div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {isCalling ? (
                            <button onClick={handleEndCall}>End Call</button>
                        ) : (
                            <button onClick={handleStartCall}>Start Call</button>
                        )}
                    </div>
                )}
            </div>

            <div>
                <h3>Your Peer ID: {peerId}</h3>
            </div>
        </div>
    );
}

export default Room;
