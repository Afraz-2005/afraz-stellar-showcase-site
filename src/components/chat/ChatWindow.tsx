
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  onClose: () => void;
}

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { 
      text: "Hi! I'm Afraz.bot, your personal AI assistant. I represent Imam Mahbir Afraz, a 20-year-old aspiring programmer from Dhaka, Bangladesh. I'd be happy to tell you more about him or assist you with anything else!", 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personalInfo = {
    education: {
      school: "Academia, Dhaka (8 years)",
      college: "SFX Greenherald International School and College, Dhaka"
    },
    location: "Dhaka, Bangladesh",
    age: 20,
    interests: {
      programming: "Started during COVID out of boredom",
      music: {
        genres: ["Lofi", "Hindi Classics", "Hollywood Pop", "Bangladeshi Band Songs"],
        artists: ["The Weeknd", "Arijit Singh", "Atif Aslam", "Pritom Hasan"]
      },
      color: "red",
      food: "all good food",
      hobbies: {
        gaming: {
          fps: ["CS2", "Overwatch", "Fragpunk", "Marvel Rivals", "Valorant"],
          favoriteGame: "Valorant"
        },
        sports: ["Football", "Badminton"],
        creative: ["Sketching", "Painting", "Playing Guitar", "Singing"]
      },
      cars: {
        interest: "Racing cars",
        favoriteCar: "Dodge Challenger Hellcat"
      },
      tech: ["Keyboard Building", "Gadgets"]
    }
  };

  const generateResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = "I'm a development version of Afraz.bot. Let me help you with information about Imam Mahbir Afraz.";

    if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
      response = `Afraz studied for 8 years at Academia, Dhaka and completed college from SFX Greenherald International School and College, Dhaka.`;
    } else if (lowerMessage.includes('music') || lowerMessage.includes('artist')) {
      response = `Afraz enjoys a wide variety of music, including lofi, Hindi classics, Hollywood pop, and Bangladeshi band songs. Some of his favorite artists are The Weeknd, Arijit Singh, and Atif Aslam.`;
    } else if (lowerMessage.includes('color')) {
      response = `Afraz's favorite color is red.`;
    } else if (lowerMessage.includes('food')) {
      response = `Afraz loves all good food! He's quite the foodie.`;
    } else if (lowerMessage.includes('gaming') || lowerMessage.includes('game')) {
      response = `Afraz is a big fan of FPS games, with Valorant being his absolute favorite. He also plays CS2, Overwatch, Fragpunk, and Marvel Rivals.`;
    } else if (lowerMessage.includes('programming') || lowerMessage.includes('code')) {
      response = `Afraz's passion for programming began during the COVID pandemic when he found himself with extra time and got interested in coding.`;
    } else if (lowerMessage.includes('age')) {
      response = `Afraz is 20 years old and is currently applying to universities.`;
    } else if (lowerMessage.includes('live') || lowerMessage.includes('location')) {
      response = `Afraz lives in Dhaka, Bangladesh.`;
    } else if (lowerMessage.includes('car') || lowerMessage.includes('racing')) {
      response = `Afraz loves cars, especially racing cars. His dream car is the Dodge Challenger Hellcat.`;
    } else if (lowerMessage.includes('hobby') || lowerMessage.includes('interest')) {
      response = `Afraz has diverse interests! He loves sketching, painting, playing guitar, singing, and is into keyboard building and tech gadgets. He also enjoys sports like football and badminton.`;
    }

    return response;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');

    // Generate response based on user input
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 w-96 h-[600px] bg-secondary/95 border border-primary/20 rounded-lg shadow-lg overflow-hidden backdrop-blur-lg z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="font-semibold text-white">Afraz.bot</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:text-primary"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-secondary/95 border-t border-primary/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-secondary-foreground/5 border-primary/20 text-white placeholder:text-white/50"
          />
          <Button
            onClick={handleSend}
            className="bg-primary hover:bg-primary/80"
          >
            Send
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
