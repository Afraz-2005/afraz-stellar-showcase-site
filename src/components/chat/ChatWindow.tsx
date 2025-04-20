
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
    { text: "Hi! I'm Afraz.bot. How can I assist you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I'm a development version of Afraz.bot. While I can show you how the chat interface works, I'm not yet connected to an AI backend.",
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
