import { Room, RoomOptions, ConnectionState } from 'livekit-client';

// LiveKit configuration
export const LIVEKIT_URL = 'wss://front-end-5cn1zla3.livekit.cloud'; 

// This would be securely generated in a real application
export const generateToken = (identity: string, room: string) => {
  // Placeholder for token generation
  // In a real app, this would call a secure backend that generates tokens
  const simulatedToken = `simulated_token_${identity}_${room}_${Date.now()}`;
  return simulatedToken;
};

// Connect to a LiveKit room
export const connectToRoom = async (identity: string, roomName: string): Promise<Room> => {
  try {
    const token = generateToken(identity, roomName);
    
    const roomOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: {
        simulcast: true,
      },
    };
    
    const room = new Room(roomOptions);
    await room.connect(LIVEKIT_URL, token);
    
    console.log('Connected to room', roomName, 'as', identity);
    return room;
  } catch (error) {
    console.error('Failed to connect to room:', error);
    throw error;
  }
};

// Disconnect from a room
export const disconnectFromRoom = (room: Room | null) => {
  if (room && room.state !== ConnectionState.Disconnected) {
    room.disconnect();
    console.log('Disconnected from room');
  }
};