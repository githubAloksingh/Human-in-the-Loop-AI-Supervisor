import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Phone, MessageSquare, User, Bot } from 'lucide-react';
import { Room, createLocalAudioTrack, LocalParticipant } from 'livekit-client';

// Salon information (for the AI to reference)
const salonInfo = {
  name: "Bella Beauty Salon",
  address: "123 Main Street, Anytown, CA 12345",
  hours: "Tuesday-Saturday 9am-7pm, Sunday-Monday Closed",
  services: [
    { name: "Haircut", price: "$50-$80", duration: "45 minutes" },
    { name: "Color", price: "$100-$150", duration: "2 hours" },
    { name: "Manicure", price: "$35", duration: "30 minutes" },
    { name: "Pedicure", price: "$45", duration: "45 minutes" }
  ],
  stylists: [
    { name: "Jennifer", specialties: ["Hair Color", "Cuts"] },
    { name: "Michael", specialties: ["Men's Cuts", "Beard Trims"] },
  ]
};

// Questions the AI can't answer
const unknownQuestions = [
  "Do you have any openings for a Brazilian blowout this Saturday?",
  "What brand of hair products do you use?",
  "Can I schedule a bridal party of 6 people next month?",
  "Is Cindy working there still?",
  "Do you offer any student discounts?",
  "How much would it cost to get highlights and balayage together?"
];

// Mock Room class for demonstration
class MockRoom {
  localParticipant: any;
  
  constructor() {
    this.localParticipant = {
      publishTrack: async () => Promise.resolve()
    };
  }
  
  async connect() {
    return Promise.resolve();
  }
  
  disconnect() {
    // Mock disconnect
  }
}

const SimulatedCall: React.FC = () => {
  const firebase = useFirebase();
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [room, setRoom] = useState<Room | MockRoom | null>(null);
  const [customerId] = useState(`customer-${Math.floor(Math.random() * 10000)}`);
  const [customerPhone] = useState(`+1${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [isWaitingForSupervisor, setIsWaitingForSupervisor] = useState(false);
  const [helpRequestId, setHelpRequestId] = useState<string | null>(null);
  
  // Simulate LiveKit room connection
  const startCall = async () => {
    setIsCallActive(true);
    setMessages([
      { sender: 'ai', text: `Hello! Thank you for calling ${salonInfo.name}. How can I help you today?` }
    ]);
    
    try {
      // Use MockRoom for demonstration
      const simulatedRoom = new MockRoom();
      await simulatedRoom.connect();
      setRoom(simulatedRoom);
      
      // Skip actual audio track creation in mock environment
      console.log('Call connected successfully (mock)');
    } catch (error) {
      console.error('Error starting call:', error);
      setIsCallActive(false);
      setMessages([]);
    }
  };
  
  const endCall = () => {
    setIsCallActive(false);
    setMessages([]);
    setUserInput('');
    setSelectedQuestion('');
    setIsWaitingForSupervisor(false);
    setHelpRequestId(null);
    
    if (room) {
      room.disconnect();
      setRoom(null);
    }
  };
  
  const sendMessage = async () => {
    if (!userInput.trim() && !selectedQuestion.trim()) return;
    
    const questionText = selectedQuestion || userInput;
    setMessages(prev => [...prev, { sender: 'user', text: questionText }]);
    setUserInput('');
    setSelectedQuestion('');
    
    // Check if this is a question the AI doesn't know
    const isUnknownQuestion = unknownQuestions.some(q => 
      questionText.toLowerCase().includes(q.toLowerCase())
    );
    
    if (isUnknownQuestion) {
      // AI doesn't know the answer - request help from supervisor
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'ai', 
            text: "Let me check with my supervisor and get back to you. Could I have your phone number so we can text you when we have an answer?" 
          }
        ]);
        
        // Simulate customer providing phone number (already set)
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { sender: 'user', text: `Sure, it's ${customerPhone}` },
            { 
              sender: 'ai', 
              text: `Great! We'll text you back at ${customerPhone} as soon as we have an answer. Is there anything else I can help you with today?` 
            }
          ]);
          
          // Create a help request
          createHelpRequest(questionText);
        }, 1500);
      }, 1000);
    } else {
      // AI knows the answer - provide it
      let response = "";
      
      if (questionText.toLowerCase().includes("hours") || questionText.toLowerCase().includes("open")) {
        response = `Our hours are ${salonInfo.hours}.`;
      } else if (questionText.toLowerCase().includes("address") || questionText.toLowerCase().includes("located")) {
        response = `We're located at ${salonInfo.address}.`;
      } else if (questionText.toLowerCase().includes("haircut") || questionText.toLowerCase().includes("cut")) {
        const service = salonInfo.services.find(s => s.name === "Haircut");
        response = `Haircuts are ${service?.price} and take approximately ${service?.duration}.`;
      } else if (questionText.toLowerCase().includes("manicure")) {
        const service = salonInfo.services.find(s => s.name === "Manicure");
        response = `Manicures are ${service?.price} and take approximately ${service?.duration}.`;
      } else if (questionText.toLowerCase().includes("stylist") || questionText.toLowerCase().includes("specialist")) {
        response = `We have ${salonInfo.stylists.length} stylists: ${salonInfo.stylists.map(s => s.name).join(" and ")}.`;
      } else {
        response = "I'd be happy to help with that. Could you provide more details about what you're looking for?";
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: response }]);
      }, 1000);
    }
  };
  
  const createHelpRequest = async (question: string) => {
    setIsWaitingForSupervisor(true);
    
    try {
      // Create a help request in Firebase
      const requestId = await firebase.createHelpRequest({
        customerId,
        customerPhone,
        question
      });
      
      setHelpRequestId(requestId);
      console.log(`Texting supervisor: "Hey, I need help answering: ${question}"`);
      
    } catch (error) {
      console.error('Error creating help request:', error);
    }
  };
  
  // Check for supervisor responses
  useEffect(() => {
    if (!helpRequestId) return;
    
    const checkForResponse = async () => {
      const unsubscribe = firebase.subscribeToRequests((requests) => {
        const currentRequest = requests.find(req => req.id === helpRequestId);
        
        if (currentRequest && currentRequest.status === 'resolved' && currentRequest.supervisorResponse) {
          // Supervisor has responded
          setIsWaitingForSupervisor(false);
          
          console.log(`Texting customer ${customerPhone}: "${currentRequest.supervisorResponse}"`);
        }
      });
      
      return unsubscribe;
    };
    
    const unsubscribe = checkForResponse();
    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }, [helpRequestId]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Simulate a Call</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Simulated Call
            </CardTitle>
          </CardHeader>
          
          <CardContent className="min-h-[300px] max-h-[400px] overflow-y-auto flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                {isCallActive ? 'Start the conversation...' : 'Start a call to begin the simulation'}
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isWaitingForSupervisor && (
              <div className="self-center mt-2 text-sm text-yellow-600 bg-yellow-50 py-1 px-3 rounded-full border border-yellow-200">
                Waiting for supervisor response...
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t">
            {!isCallActive ? (
              <Button 
                className="w-full" 
                leftIcon={<Phone className="w-4 h-4" />}
                onClick={startCall}
              >
                Start Call
              </Button>
            ) : (
              <div className="w-full space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isWaitingForSupervisor}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={(!userInput.trim() && !selectedQuestion.trim()) || isWaitingForSupervisor}
                  >
                    Send
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={endCall}
                  >
                    End Call
                  </Button>
                </div>
                
                {selectedQuestion && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <span>Selected: {selectedQuestion}</span>
                    <button 
                      className="ml-auto text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedQuestion('')}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Sample Questions
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500 mb-2">Questions the AI can answer:</p>
            <button 
              className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
              onClick={() => setSelectedQuestion("What are your hours?")}
              disabled={!isCallActive || isWaitingForSupervisor}
            >
              What are your hours?
            </button>
            <button 
              className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
              onClick={() => setSelectedQuestion("Where are you located?")}
              disabled={!isCallActive || isWaitingForSupervisor}
            >
              Where are you located?
            </button>
            <button 
              className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
              onClick={() => setSelectedQuestion("How much is a haircut?")}
              disabled={!isCallActive || isWaitingForSupervisor}
            >
              How much is a haircut?
            </button>
            
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-2">Questions the AI doesn't know:</p>
              {unknownQuestions.slice(0, 3).map((question, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-2 text-sm bg-yellow-50 hover:bg-yellow-100 rounded transition-colors mb-2"
                  onClick={() => setSelectedQuestion(question)}
                  disabled={!isCallActive || isWaitingForSupervisor}
                >
                  {question}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimulatedCall;