import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './ChatMessage';
import { toast } from 'sonner';

interface ChatWindowProps {
  onClose: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi! I'm Afraz.bot, your personal AI assistant. I represent Imam Mahbir Afraz, a 20-year-old aspiring programmer from Dhaka, Bangladesh. I'd be happy to tell you more about him or assist you with anything else!", 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Call Supabase Edge Function
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          personalInfo,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      return data.message || generateFallbackResponse(userMessage);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      return generateFallbackResponse(userMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    let response = "Sorry, I'm having trouble connecting to my brain right now. Let me tell you about Afraz instead!";
    
    // Add some humor to responses
    const humorousRemarks = [
      "As Afraz would say, 'Why debug when you can just restart the computer?' Just kidding! He's actually quite meticulous with his code.",
      "Afraz once tried to explain programming to his cat. The cat was more interested in chasing the cursor.",
      "If Afraz's life had error messages, they'd probably say 'Too many hobbies found. Consider removing some for optimal performance.'",
      "Afraz believes keyboards are like cars - the more mechanical and noisy, the better!",
      "When Afraz isn't coding, he's probably explaining to his family why he needs another mechanical keyboard."
    ];

    if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
      response = `Afraz studied for 8 years at Academia, Dhaka and completed college from SFX Greenherald International School and College, Dhaka. ${humorousRemarks[0]}`;
    } else if (lowerMessage.includes('music') || lowerMessage.includes('artist')) {
      response = `Afraz enjoys a wide variety of music, including lofi, Hindi classics, Hollywood pop, and Bangladeshi band songs. Some of his favorite artists are The Weeknd, Arijit Singh, and Atif Aslam. His shower concerts are legendary, but audience reviews are mixed!`;
    } else if (lowerMessage.includes('color')) {
      response = `Afraz's favorite color is red. Not just any red - the specific red of a sports car going way too fast for his parents' comfort!`;
    } else if (lowerMessage.includes('food')) {
      response = `Afraz loves all good food! He's quite the foodie. His philosophy is "if calories don't see you eating them, they don't count." Flawless logic!`;
    } else if (lowerMessage.includes('gaming') || lowerMessage.includes('game')) {
      response = `Afraz is a big fan of FPS games, with Valorant being his absolute favorite. He also plays CS2, Overwatch, Fragpunk, and Marvel Rivals. His gaming skills are inversely proportional to how much homework he has!`;
    } else if (lowerMessage.includes('programming') || lowerMessage.includes('code')) {
      response = `Afraz's passion for programming began during the COVID pandemic when he found himself with extra time and got interested in coding. He started with "Hello World" and now he's convinced semicolons are just decoration. ${humorousRemarks[1]}`;
    } else if (lowerMessage.includes('age')) {
      response = `Afraz is 20 years old and is currently applying to universities. In programming years, that's about 5 caffeine-fueled project deadlines old!`;
    } else if (lowerMessage.includes('live') || lowerMessage.includes('location')) {
      response = `Afraz lives in Dhaka, Bangladesh. A place where the traffic gives him plenty of time to think about code optimization!`;
    } else if (lowerMessage.includes('car') || lowerMessage.includes('racing')) {
      response = `Afraz loves cars, especially racing cars. His dream car is the Dodge Challenger Hellcat. He probably spends more time customizing virtual cars than he'll ever spend in real ones!`;
    } else if (lowerMessage.includes('hobby') || lowerMessage.includes('interest')) {
      response = `Afraz has diverse interests! He loves sketching, painting, playing guitar, singing, and is into keyboard building and tech gadgets. ${humorousRemarks[2]} He also enjoys sports like football and badminton when not busy collecting hobbies.`;
    } else if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why did the programmer quit his job? Because he didn't get arrays!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "A programmer's wife tells him: 'Go to the store and pick up a loaf of bread. If they have eggs, get a dozen.' The programmer comes back with 12 loaves of bread."
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    } else {
      // Add some humor to generic responses
      const genericResponses = [
        `I'm still learning about that! Unlike Afraz's keyboard collection, my knowledge has some limits.`,
        `Hmm, that's an interesting question! I'd give you Afraz's opinion, but he's probably busy choosing between gaming and practicing guitar right now.`,
        `I don't have all the details on that yet. Afraz would say it's like debugging - sometimes you just have to console.log() everything!`,
        `I'm not sure about that one. Afraz would probably Google it while pretending he already knows the answer!`
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');

    // Add thinking indicator
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponse = await generateAIResponse(userMessage);
      
      setMessages(prev => [...prev, {
        text: aiResponse,
        isUser: false
      }]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast.error("Couldn't get a response. Please try again!");
      
      // Add fallback response
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble thinking right now! Let's chat again in a moment.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
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
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white p-3 rounded-lg rounded-bl-none max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
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
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            className="bg-primary hover:bg-primary/80"
            disabled={isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
