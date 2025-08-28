"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, X, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "Emma",
    age: 25,
    bio: "Love hiking and photography 📸",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
    interests: ["Photography", "Hiking", "Travel"],
  },
  {
    id: 2,
    name: "Alex",
    age: 28,
    bio: "Software engineer who loves cooking 👨‍💻🍳",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    interests: ["Coding", "Cooking", "Gaming"],
  },
  {
    id: 3,
    name: "Sophia",
    age: 26,
    bio: "Artist and yoga enthusiast 🧘‍♀️✨",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
    interests: ["Art", "Yoga", "Meditation"],
  },
  {
    id: 4,
    name: "Marcus",
    age: 30,
    bio: "Musician and coffee lover ☕🎸",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
    interests: ["Music", "Coffee", "Books"],
  },
  {
    id: 5,
    name: "Luna",
    age: 24,
    bio: "Designer who loves dancing 💃🎨",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
    interests: ["Design", "Dancing", "Fashion"],
  },
];

interface User {
  id: number;
  name: string;
  age: number;
  bio: string;
  image: string;
  interests: string[];
}

interface Match {
  user: User;
  timestamp: Date;
}

interface Message {
  id: number;
  matchId: number;
  text: string;
  timestamp: Date;
  fromMe: boolean;
}

export default function TinderPage() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const currentUser = mockUsers[currentUserIndex];

  const handleSwipe = (liked: boolean) => {
    if (liked && currentUser) {
      // Simulate a match (50% chance)
      if (Math.random() > 0.5) {
        const newMatch: Match = {
          user: currentUser,
          timestamp: new Date(),
        };
        setMatches(prev => [...prev, newMatch]);
      }
    }

    // Move to next user
    if (currentUserIndex < mockUsers.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
    } else {
      // Reset to beginning or show end message
      setCurrentUserIndex(0);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedMatch) return;

    const message: Message = {
      id: Date.now(),
      matchId: selectedMatch.user.id,
      text: newMessage.trim(),
      timestamp: new Date(),
      fromMe: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate a response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Hey! How are you?",
        "Nice to meet you!",
        "That sounds interesting!",
        "What are you up to today?",
        "I'd love to know more about that!",
      ];
      
      const responseMessage: Message = {
        id: Date.now() + 1,
        matchId: selectedMatch.user.id,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        fromMe: false,
      };

      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const getMessagesForMatch = (matchId: number) => {
    return messages.filter(msg => msg.matchId === matchId);
  };

  if (selectedMatch) {
    const chatMessages = getMessagesForMatch(selectedMatch.user.id);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Chat Header */}
          <div className="bg-white rounded-t-lg shadow-lg p-4 flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMatch(null)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Image
              src={selectedMatch.user.image}
              alt={selectedMatch.user.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{selectedMatch.user.name}</h3>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white shadow-lg h-96 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <p>Start the conversation!</p>
                <p className="text-sm mt-1">Say something nice to {selectedMatch.user.name}</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.fromMe
                        ? 'bg-pink-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.fromMe ? 'text-pink-200' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white rounded-b-lg shadow-lg p-4 flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Button onClick={sendMessage} className="bg-pink-500 hover:bg-pink-600">
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showMatches) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Matches Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowMatches(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Swiping
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
            <div></div>
          </div>

          {/* Matches List */}
          {matches.length === 0 ? (
            <div className="text-center mt-20">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No matches yet</h2>
              <p className="text-gray-500">Keep swiping to find your perfect match!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent
                    className="p-4 flex items-center space-x-4"
                    onClick={() => setSelectedMatch(match)}
                  >
                    <Image
                      src={match.user.image}
                      alt={match.user.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{match.user.name}</h3>
                      <p className="text-gray-500">Matched {match.timestamp.toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 mt-1">{match.user.bio}</p>
                    </div>
                    <MessageCircle className="w-6 h-6 text-pink-500" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
            Tinder Clone
          </h1>
          <Button
            variant="ghost"
            onClick={() => setShowMatches(true)}
            className="relative"
          >
            <Heart className="w-6 h-6" />
            {matches.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {matches.length}
              </span>
            )}
          </Button>
        </div>

        {/* Profile Card */}
        {currentUser ? (
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl">
              <div className="relative">
                <Image
                  src={currentUser.image}
                  alt={currentUser.name}
                  width={400}
                  height={600}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {currentUser.name}, {currentUser.age}
                  </h2>
                  <p className="text-sm mb-3">{currentUser.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-8 mt-6">
              <Button
                onClick={() => handleSwipe(false)}
                className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full shadow-lg"
                size="lg"
              >
                <X className="w-8 h-8" />
              </Button>
              <Button
                onClick={() => handleSwipe(true)}
                className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg"
                size="lg"
              >
                <Heart className="w-8 h-8" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No more profiles</h2>
            <p className="text-gray-500">Check back later for more people!</p>
            <Button
              onClick={() => setCurrentUserIndex(0)}
              className="mt-4 bg-pink-500 hover:bg-pink-600"
            >
              Start Over
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Profile {currentUserIndex + 1} of {mockUsers.length}</p>
          <p className="mt-1">{matches.length} matches found</p>
        </div>
      </div>
    </div>
  );
}