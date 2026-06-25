import React, { useState, useEffect, useRef } from 'react';

type ChatStep = 'greeting' | 'name' | 'phone' | 'email' | 'date' | 'venue' | 'message' | 'done';
type ChatMessage = { id: string; sender: 'bot' | 'user'; text: string };

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>('greeting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '', venue: '', message: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ 
          id: '1', 
          sender: 'bot', 
          text: "Hi! I'm the RealImage AI assistant. ✨ I'm here to help you. To get started, what is your name?" 
        }]);
        setStep('name');
      }, 300);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const saveEnquiry = (name: string, phone: string, email: string, date: string, venue: string, message: string) => {
    const entry = {
      name,
      email,
      phone,
      weddingDate: date,
      venue,
      serviceType: 'AI Assistant Enquiry',
      budget: '',
      message,
      id: Date.now().toString(36),
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    
    try {
      const existing = JSON.parse(localStorage.getItem('realimage_enquiries') ?? '[]');
      existing.push(entry);
      localStorage.setItem('realimage_enquiries', JSON.stringify(existing));
    } catch (err) {}
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userText = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setInputValue('');
    
    // Simulate AI thinking delay
    setTimeout(() => {
      let botReply = '';
      
      if (step === 'name') {
        setFormData(prev => ({ ...prev, name: userText }));
        botReply = `Nice to meet you, ${userText}! Could you please share your phone number so our team can reach out?`;
        setStep('phone');
      } else if (step === 'phone') {
        setFormData(prev => ({ ...prev, phone: userText }));
        botReply = `Got it. Could you please provide your email address?`;
        setStep('email');
      } else if (step === 'email') {
        setFormData(prev => ({ ...prev, email: userText }));
        botReply = `Thanks! When is the date of your event?`;
        setStep('date');
      } else if (step === 'date') {
        setFormData(prev => ({ ...prev, date: userText }));
        botReply = `Great. Where is the venue located?`;
        setStep('venue');
      } else if (step === 'venue') {
        setFormData(prev => ({ ...prev, venue: userText }));
        botReply = `Perfect. Finally, tell me a bit about what you're looking for (e.g., Wedding photography, Pre-wedding shoot, Event).`;
        setStep('message');
      } else if (step === 'message') {
        setFormData(prev => ({ ...prev, message: userText }));
        saveEnquiry(formData.name, formData.phone, formData.email, formData.date, formData.venue, userText);
        botReply = `Thank you! I've sent your details over to the RealImage team. They will be in touch with you very soon! Have a wonderful day. 😊`;
        setStep('done');
      }
      
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <>
      {/* The Chat Window Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '340px',
            height: '480px',
            backgroundColor: '#06141F',
            border: '1px solid rgba(91,164,181,0.3)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Noto Sans SC', sans-serif",
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .chat-scroll::-webkit-scrollbar {
              width: 6px;
            }
            .chat-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .chat-scroll::-webkit-scrollbar-thumb {
              background: rgba(91,164,181,0.3);
              border-radius: 10px;
            }
          `}</style>
          
          {/* Header */}
          <div style={{
            backgroundColor: 'rgba(91,164,181,0.1)',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(91,164,181,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#5BA4B5', boxShadow: '0 0 8px #5BA4B5' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#D6E8EE', fontWeight: 600, fontSize: '15px' }}>RealImage AI</span>
                <span style={{ color: 'rgba(214,232,238,0.5)', fontSize: '11px', letterSpacing: '0.05em' }}>Online</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#D6E8EE', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="chat-scroll" style={{ 
            flex: 1, 
            padding: '20px 16px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px' 
          }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#5BA4B5' : 'rgba(255,255,255,0.05)',
                  color: msg.sender === 'user' ? '#06141F' : '#D6E8EE',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid rgba(91,164,181,0.2)',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            {step === 'done' ? (
              <div style={{ textAlign: 'center', color: 'rgba(214,232,238,0.5)', fontSize: '13px', padding: '8px 0' }}>
                Chat ended. The team will contact you soon.
              </div>
            ) : (
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type={step === 'phone' ? 'tel' : step === 'email' ? 'email' : step === 'date' ? 'date' : 'text'}
                  placeholder={step === 'date' ? '' : "Type your message..."}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px 16px',
                    borderRadius: '24px',
                    color: '#D6E8EE',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(91,164,181,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  style={{
                    backgroundColor: inputValue.trim() ? '#5BA4B5' : 'rgba(91,164,181,0.3)',
                    color: '#06141F',
                    border: 'none',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.3s',
                    flexShrink: 0
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-1px) translateY(1px)' }}>
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* The Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: isOpen ? 'linear-gradient(135deg, #EFBF04, #D4A903)' : 'linear-gradient(135deg, #5BA4B5, #4A8C9B)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isOpen ? '0 4px 14px rgba(239,191,4,0.4)' : '0 4px 14px rgba(91,164,181,0.4)',
          zIndex: 1000,
          cursor: 'pointer',
          border: 'none',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label={isOpen ? "Close Chat" : "Chat with AI"}
      >
        {isOpen ? (
          <span style={{ color: '#06141F', fontSize: '24px', fontWeight: 'bold' }}>✕</span>
        ) : (
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#06141F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </>
  );
}
