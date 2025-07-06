import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending message to server...');
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: sessionId,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      const botMessage: Message = {
        id: data.id,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(data.timestamp),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = "Sorry, I'm having trouble connecting right now. Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorText = "Cannot connect to server. Please make sure the backend server is running on port 3001.";
        } else if (error.message.includes('status: 500')) {
          errorText = "Server error occurred. Please try again.";
        } else if (error.message.includes('status: 400')) {
          errorText = "Invalid request. Please try again.";
        }
      }

      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button with Speech Bubble */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Speech Bubble */}
        {!isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 sm:bottom-20 sm:right-0 mb-2"
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 2, duration: 0.5, ease: "easeOut" }}
          >
            <div className="relative bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-2xl shadow-lg border border-gray-200 max-w-[200px] sm:max-w-[220px]">
              <p className="text-sm font-medium leading-tight">
                Ask me literally anything about Afraz! 💬
              </p>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white/95 border-r border-b border-gray-200 transform rotate-45"></div>
            </div>
          </motion.div>
        )}
        
        <Button
          onClick={isOpen ? closeChat : () => setIsOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Fullscreen Background Blur */}
      <AnimatePresence>
        {isOpen && isFullscreen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-50 ${
              isFullscreen 
                ? 'inset-2 sm:inset-4 m-2 sm:m-4' 
                : 'bottom-20 right-2 left-2 sm:bottom-24 sm:right-6 sm:left-auto w-auto sm:w-96 h-[calc(100vh-120px)] sm:h-[500px] max-h-[600px] sm:max-h-none'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className={`h-full bg-black/90 backdrop-blur border-primary/20 shadow-2xl ${
              isFullscreen ? 'max-w-4xl mx-auto' : 'max-w-full'
            }`}>
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bot className="h-5 w-5 text-primary" />
                    Ask me about Afraz
                  </CardTitle>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      onClick={toggleFullscreen}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/10"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={closeChat}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/10"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages Area */}
                <ScrollArea 
                  className="flex-1 p-3 sm:p-4" 
                  ref={scrollAreaRef}
                  style={{ 
                    height: isFullscreen 
                      ? 'calc(100vh - 200px)' 
                      : window.innerWidth < 640 
                        ? 'calc(100vh - 200px)' 
                        : '400px',
                    maxHeight: isFullscreen 
                      ? 'calc(100vh - 200px)' 
                      : window.innerWidth < 640 
                        ? 'calc(100vh - 200px)' 
                        : '400px'
                  }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                      <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                      <p className="text-sm">Hi! I'm Afraz's AI assistant. Ask me anything about him!</p>
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500">Try asking:</p>
                        <div className="space-y-1">
                          <p className="text-xs text-primary/70">• "What are Afraz's skills?"</p>
                          <p className="text-xs text-primary/70">• "Tell me about his projects"</p>
                          <p className="text-xs text-primary/70">• "How can I contact him?"</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pb-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[90%] sm:max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender === 'user' 
                                ? 'bg-primary text-white' 
                                : message.text.includes('trouble') || message.text.includes('error') || message.text.includes('connect')
                                ? 'bg-red-500 text-white'
                                : 'bg-secondary text-primary'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : message.text.includes('trouble') || message.text.includes('error') || message.text.includes('connect') ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                            </div>
                            <div className={`rounded-lg px-3 py-2 break-words ${
                              message.sender === 'user'
                                ? 'bg-primary text-white'
                                : message.text.includes('trouble') || message.text.includes('error') || message.text.includes('connect')
                                ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                                : 'bg-secondary/50 text-white'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-secondary/50 rounded-lg px-3 py-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="p-3 sm:p-4 border-t border-primary/20 bg-black/50">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about Afraz..."
                      className="flex-1 bg-secondary/50 border-primary/20 text-white placeholder:text-gray-400 focus:border-primary text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="icon"
                      className="bg-primary hover:bg-primary/90 h-10 w-10 sm:h-10 sm:w-10"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 