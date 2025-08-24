
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}

interface AIChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AIChat = ({ isOpen, onToggle }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Nike shopping assistant. I can help you find the perfect shoes, check availability, compare products, and answer any questions about our collection. What can I help you with today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dummy AI responses with product suggestions
  const getAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('jordan') || lowerMessage.includes('basketball')) {
      return {
        id: Date.now().toString(),
        text: "Great choice! I found some amazing Jordan basketball shoes for you. The Air Jordan 1 Retro High OG is our most popular model - it's the iconic silhouette that started it all. Would you like to see more details or check other Jordan models?",
        sender: 'ai',
        timestamp: new Date(),
        products: [
          {
            id: '1',
            name: 'Air Jordan 1 Retro High OG',
            price: 170,
            image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop'
          }
        ]
      };
    } else if (lowerMessage.includes('air max') || lowerMessage.includes('running')) {
      return {
        id: Date.now().toString(),
        text: "Perfect for running! Our Air Max series offers revolutionary cushioning technology. The Air Max 90 and Air Max 270 are both excellent choices for comfort and style. Which type of running do you do - casual or performance?",
        sender: 'ai',
        timestamp: new Date(),
        products: [
          {
            id: '2',
            name: 'Nike Air Max 90',
            price: 120,
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop'
          },
          {
            id: '5',
            name: 'Nike Air Max 270',
            price: 150,
            image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&h=300&fit=crop'
          }
        ]
      };
    } else if (lowerMessage.includes('women') || lowerMessage.includes('lifestyle')) {
      return {
        id: Date.now().toString(),
        text: "Our women's lifestyle collection is fantastic! The Nike Dunk Low and Blazer Mid '77 are very popular choices that combine vintage basketball style with modern comfort. What's your preferred style - classic or modern?",
        sender: 'ai',
        timestamp: new Date(),
        products: [
          {
            id: '3',
            name: 'Nike Dunk Low',
            price: 100,
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop'
          },
          {
            id: '6',
            name: 'Nike Blazer Mid \'77',
            price: 100,
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop'
          }
        ]
      };
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
      return {
        id: Date.now().toString(),
        text: "I understand you're looking for great value! The Air Force 1 '07 at $90 is our most affordable classic, and it's a legend that lives on. It offers amazing quality for the price. Would you like to see our full range of shoes under $120?",
        sender: 'ai',
        timestamp: new Date(),
        products: [
          {
            id: '4',
            name: 'Air Force 1 \'07',
            price: 90,
            image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=300&h=300&fit=crop'
          }
        ]
      };
    } else if (lowerMessage.includes('size') || lowerMessage.includes('fitting')) {
      return {
        id: Date.now().toString(),
        text: "Great question about sizing! We offer sizes from 7 to 12, including half sizes. Most Nike shoes fit true to size, but I'd recommend trying them on if possible. For online orders, we have a 30-day return policy if the fit isn't perfect. What size are you usually?",
        sender: 'ai',
        timestamp: new Date()
      };
    } else if (lowerMessage.includes('stock') || lowerMessage.includes('available')) {
      return {
        id: Date.now().toString(),
        text: "All the products I've shown you are currently in stock and available for immediate shipping! We update our inventory in real-time. Would you like me to check specific sizes for any particular model?",
        sender: 'ai',
        timestamp: new Date()
      };
    } else {
      return {
        id: Date.now().toString(),
        text: "I'd be happy to help you find the perfect Nike shoes! You can ask me about:\n\n• Specific models (Jordan, Air Max, Dunk, etc.)\n• Categories (Men's, Women's, Kids', Running, Basketball)\n• Price ranges and budget options\n• Size availability\n• Product comparisons\n\nWhat interests you most?",
        sender: 'ai',
        timestamp: new Date()
      };
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = getAIResponse(inputText);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-nike-orange hover:bg-nike-orange/90 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 bg-white shadow-xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[500px]'
    }`}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-nike-orange" />
            Nike Assistant
            <Badge variant="secondary" className="ml-2">Online</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 h-80">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-nike-orange text-white'
                          : 'bg-nike-light-gray text-nike-dark'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    
                    {message.products && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-nike-dark truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-nike-orange font-semibold">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="h-3 w-3 text-nike-gray" />
                      ) : (
                        <Bot className="h-3 w-3 text-nike-gray" />
                      )}
                      <span className="text-xs text-nike-gray">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Nike products..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIChat;
