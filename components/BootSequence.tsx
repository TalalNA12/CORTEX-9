import React, { useEffect, useState } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "BIOS CHECK... OK",
  "LOADING KERNEL... OK",
  "MOUNTING FILE SYSTEMS...",
  "BYPASSING CORP FIREWALL...",
  "INITIALIZING CORTEX-9...",
  "ESTABLISHING SECURE TUNNEL...",
  "DECRYPTING PAYLOAD...",
  "WELCOME SAMURAI."
];

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentLogIndex = 0;
    
    const interval = setInterval(() => {
      if (currentLogIndex < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLogIndex]]);
        currentLogIndex++;
        setProgress(prev => prev + (100 / BOOT_LOGS.length));
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800); 
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#020202] text-[#fcee0a] font-['Rajdhani'] z-50 fixed top-0 left-0 p-8 overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="max-w-3xl w-full relative z-10">
        
        <div className="flex justify-between items-end mb-4 border-b border-[#333] pb-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter glitch-text leading-none text-white" data-text="CORTEX-9">
            CORTEX-9
            </h1>
            <span className="text-[#ff003c] font-bold text-xl tracking-widest hidden md:block">ARASAKA//CONFIDENTIAL</span>
        </div>
        
        <div className="border-l-4 border-[#00f0ff] pl-6 py-4 bg-[#0a0a0a] clip-corner-br shadow-lg">
          <div className="flex flex-col space-y-1 h-48 overflow-hidden font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="flex items-center space-x-3 tracking-wider">
                 <span className="text-[#ff003c]">{`>>`}</span>
                 <span className={index === logs.length - 1 ? "text-[#fcee0a] animate-pulse font-bold" : "text-gray-400"}>
                   {log}
                 </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1a1a1a] h-2 mt-6 relative overflow-hidden">
          <div 
            className="h-full bg-[#ff003c] transition-all duration-100 ease-out shadow-[0_0_10px_#ff003c]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-[10px] mt-2 font-bold text-[#00f0ff] uppercase tracking-[0.2em]">
          <span>System Integrity: 100%</span>
          <span>Security Level: NULL</span>
        </div>
      </div>
    </div>
  );
};

export default BootSequence;