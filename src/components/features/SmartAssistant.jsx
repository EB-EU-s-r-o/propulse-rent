import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MessageSquare, TrendingUp, DollarSign, PenTool } from 'lucide-react';

export const SmartAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! I am your AI Real Estate Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            let responseText = "I'm processing your request...";

            if (text.toLowerCase().includes('price')) {
                responseText = "Based on current market trends in Pattaya, a 1-bedroom condo of 45sqm should be priced around ฿3.5M - ฿4.2M depending on the view.";
            } else if (text.toLowerCase().includes('description')) {
                responseText = "Here's a catchy description: 'Stunning ocean-view sanctuary! This modern 1-bedroom gem offers 45sqm of luxury living, featuring a private balcony, state-of-the-art kitchen, and access to a rooftop infinity pool. Perfect for investors or holiday home seekers.'";
            } else if (text.toLowerCase().includes('sentiment')) {
                responseText = "I've analyzed the last 5 lead messages. The sentiment is predominantly POSITIVE (80%). Keywords: 'view', 'price', 'visit'. Suggestion: Follow up immediately with viewing slots.";
            } else {
                responseText = "I can help you with Property Descriptions, Smart Pricing, or Lead Sentiment Analysis. Try asking about one of those!";
            }

            const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleQuickAction = (action) => {
        let prompt = '';
        switch (action) {
            case 'desc': prompt = 'Generate a description for a luxury condo'; break;
            case 'price': prompt = 'Suggest pricing for a 45sqm unit'; break;
            case 'sentiment': prompt = 'Analyze recent lead sentiment'; break;
            default: return;
        }
        handleSend(prompt);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                className={`ai-fab ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                title="AI Assistant"
            >
                <Sparkles size={24} />
            </button>

            {/* Chat Interface */}
            <div className={`ai-assistant-panel ${isOpen ? 'open' : ''}`}>
                <div className="ai-header">
                    <div className="ai-title">
                        <Sparkles size={18} className="text-accent" />
                        <h3>AI Assistant</h3>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                <div className="ai-messages">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.type}`}>
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message bot">
                            <div className="message-bubble typing">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="ai-quick-actions">
                    <button onClick={() => handleQuickAction('desc')} title="Generate Description">
                        <PenTool size={14} /> Description
                    </button>
                    <button onClick={() => handleQuickAction('price')} title="Smart Pricing">
                        <DollarSign size={14} /> Pricing
                    </button>
                    <button onClick={() => handleQuickAction('sentiment')} title="Sentiment Analysis">
                        <TrendingUp size={14} /> Sentiment
                    </button>
                </div>

                <div className="ai-input-area">
                    <input
                        type="text"
                        placeholder="Ask AI anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={() => handleSend()}>
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </>
    );
};
