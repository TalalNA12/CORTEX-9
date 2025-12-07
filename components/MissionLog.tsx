import React, { useEffect, useState } from 'react';

const DAILY_TASKS = [
  "Complete 1 Nmap Scan Simulation",
  "Research SQL Injection Vectors",
  "Attempt Privilege Escalation (sim)",
  "Review Wireshark Logs",
  "Practice Cross-Site Scripting (XSS)",
  "Study Buffer Overflow Basics",
  "Analyze Malware Signatures"
];

const MissionLog: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [dailyTask, setDailyTask] = useState("");

  useEffect(() => {
    // Basic local storage persistence for the "Daily Schedule" feel
    const lastLogin = localStorage.getItem('cortex_last_login');
    const currentStreak = parseInt(localStorage.getItem('cortex_streak') || '0');
    const today = new Date().toDateString();

    // Assign a random task for the day based on the date
    const dayIndex = new Date().getDate() % DAILY_TASKS.length;
    setDailyTask(DAILY_TASKS[dayIndex]);

    if (lastLogin !== today) {
      // New day login
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === yesterday.toDateString()) {
        // Continue streak
        const newStreak = currentStreak + 1;
        setStreak(newStreak);
        localStorage.setItem('cortex_streak', newStreak.toString());
      } else {
        // Reset streak if missed a day, or first time
        if (!lastLogin) {
            setStreak(1);
            localStorage.setItem('cortex_streak', '1');
        } else {
            // Missed a day
             setStreak(1);
             localStorage.setItem('cortex_streak', '1');
        }
      }
      localStorage.setItem('cortex_last_login', today);
    } else {
      setStreak(currentStreak);
    }
  }, []);

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4 text-[#fcee0a]">
      {/* Street Cred / Streak Panel */}
      <div className="bg-[#111] border border-[#fcee0a] p-1 clip-corner-br">
         <div className="bg-[#fcee0a] text-black text-xs font-bold px-2 py-1 uppercase flex justify-between">
            <span>NET_STATUS</span>
            <span>CONN: SECURE</span>
         </div>
         <div className="p-4 flex flex-col items-center">
            <div className="text-4xl font-black text-[#ff003c] glitch-text" data-text={streak}>
               {streak}
            </div>
            <div className="text-xs uppercase tracking-widest text-[#00f0ff] mt-1">Day Streak</div>
         </div>
      </div>

      {/* Daily Gig Panel */}
      <div className="bg-[#111] border border-[#00f0ff] p-1 clip-corner-tl flex-1 md:h-auto">
         <div className="bg-[#00f0ff] text-black text-xs font-bold px-2 py-1 uppercase mb-2">
            DAILY_PROTOCOL
         </div>
         <div className="p-3">
            <h3 className="text-[#ff003c] font-bold uppercase text-sm mb-2 underline decoration-[#ff003c]">
               Current Directive
            </h3>
            <p className="text-sm font-mono leading-tight text-gray-300">
               {dailyTask}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-800">
               <div className="flex justify-between items-center text-[10px] uppercase text-[#fcee0a]">
                  <span>Difficulty</span>
                  <div className="flex space-x-0.5">
                     <div className="w-2 h-2 bg-[#ff003c]"></div>
                     <div className="w-2 h-2 bg-[#ff003c]"></div>
                     <div className="w-2 h-2 bg-[#ff003c]"></div>
                     <div className="w-2 h-2 bg-[#333]"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Decorative 'Ads' or Info */}
      <div className="hidden md:block opacity-50">
        <div className="border border-[#333] p-2 text-center">
           <div className="text-[10px] text-[#333] font-mono">ADVERTISEMENT</div>
           <div className="text-[#ff003c] font-black uppercase text-lg leading-none">TRAUMA TEAM</div>
           <div className="text-[9px] text-gray-500">PLATINUM COVERAGE AVAILABLE</div>
        </div>
      </div>
    </div>
  );
};

export default MissionLog;