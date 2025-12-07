import React, { useState, useEffect, useRef } from 'react';
import BootSequence from './components/BootSequence';
import MessageBubble from './components/MessageBubble';
import MissionLog from './components/MissionLog';
import { Message, MessageRole } from './types';
import { sendMessageToCortex, initializeChatSession } from './services/geminiService';

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBootComplete = async () => {
    setBooted(true);
    initializeChatSession();
    
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const initialMsg: Message = {
      id: 'init-1',
      role: MessageRole.MODEL,
      timestamp,
      content: `### NEURAL LINK ESTABLISHED.\n\nWake the f**k up, Samurai. We have a network to burn.\n\nI am **CORTEX-9**. I'm here to sharpen your edge so you don't get flatlined by the first corporate ICE you touch.\n\nInitialize training? Run: \`cmd /start\``
    };
    setMessages([initialMsg]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userCmd = input.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: userCmd,
      timestamp
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const responseText = await sendMessageToCortex(userCmd);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour12: false })
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        content: `[!] CRITICAL FAILURE: SIGNAL LOST.`,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (!booted) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <div className="h-screen bg-[#020202] text-[#fcee0a] font-sans flex flex-col overflow-hidden relative selection:bg-[#fcee0a] selection:text-black">
      
      {/* HUD Header */}
      <header className="h-12 border-b border-[#333] bg-[#0a0a0a] flex items-center justify-between px-4 z-20 shrink-0">
         <div className="flex items-center space-x-4">
             <div className="text-xl font-black italic tracking-tighter text-[#fcee0a]">CORTEX-9</div>
             <div className="hidden md:flex space-x-1">
                 <div className="w-16 h-1 bg-[#ff003c]"></div>
                 <div className="w-4 h-1 bg-[#00f0ff]"></div>
                 <div className="w-2 h-1 bg-[#fcee0a]"></div>
             </div>
         </div>
         <div className="text-[#00f0ff] font-mono text-xs tracking-widest flex items-center gap-4">
             <span className="hidden sm:inline">COORDS: 34.0522° N, 118.2437° W</span>
             <span className={isProcessing ? "animate-pulse text-[#fcee0a]" : ""}>
                 {isProcessing ? "PROCESSING..." : "ONLINE"}
             </span>
         </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 flex overflow-hidden p-2 md:p-4 gap-4 max-w-[1920px] mx-auto w-full">
        
        {/* Left/Center Panel (Terminal) */}
        <div className="flex-1 flex flex-col relative clip-panel bg-[#0a0a0a]/80 backdrop-blur border-l-2 border-r-2 border-[#333] shadow-[0_0_30px_rgba(0,240,255,0.05)]">
            
            {/* Terminal Header */}
            <div className="bg-[#111] p-2 flex justify-between items-center border-b border-[#333]">
                <div className="text-[10px] font-bold text-[#ff003c] uppercase tracking-widest pl-2">
                    Terminal_Session_001
                </div>
                <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-[#333]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#333]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#fcee0a] animate-pulse"></div>
                </div>
            </div>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
                {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
                ))}
                {isProcessing && (
                <div className="flex items-center space-x-2 text-[#fcee0a] px-4 font-mono text-xs animate-pulse opacity-70">
                    <span>[!] DECRYPTING NEURAL DATA...</span>
                </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="p-4 bg-[#050505] border-t border-[#333] relative z-10">
                <form onSubmit={handleCommand} className="flex items-center w-full bg-[#111] border border-[#333] p-2 clip-corner-br focus-within:border-[#fcee0a] transition-colors">
                    <span className="text-[#ff003c] mr-2 font-bold font-mono">{`root@cortex:~#`}</span>
                    <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-none outline-none text-[#00f0ff] font-mono text-base placeholder-[#444]"
                    placeholder="Enter command..."
                    autoComplete="off"
                    autoFocus
                    />
                    <button type="submit" className="text-[#fcee0a] hover:text-[#fff] px-2 font-bold">{`[SUBMIT]`}</button>
                </form>
            </footer>
        </div>

        {/* Right Panel (Mission Log / Schedule) */}
        <div className="hidden md:flex flex-col">
           <MissionLog />
        </div>

      </div>
    </div>
  );
};

export default App;