import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, MessageRole } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          relative max-w-[90%] md:max-w-[85%] 
          p-1
          ${isUser ? 'clip-corner-tl' : 'clip-corner-br'}
        `}
      >
        {/* Decorative Background for Message */}
        <div className={`
          absolute inset-0 opacity-10 
          ${isUser ? 'bg-[#00f0ff]' : 'bg-[#fcee0a]'}
          z-0
        `}></div>

        {/* Border wrapper */}
        <div className={`
          relative z-10 border-l-4 p-4 bg-[#0a0a0a] 
          ${isUser ? 'border-[#00f0ff]' : 'border-[#fcee0a]'}
        `}>
          
          {/* Header line */}
          <div className="flex items-center justify-between text-[10px] md:text-xs mb-3 font-bold tracking-widest uppercase font-mono border-b border-gray-800 pb-1">
             <div className="flex items-center space-x-2">
                <span className={isUser ? 'text-[#00f0ff]' : 'text-[#fcee0a]'}>
                   {isUser ? 'SAMURAI' : 'CORTEX-9'} // {message.timestamp}
                </span>
             </div>
             {!isUser && <span className="text-[#ff003c]">NET_ADMIN</span>}
          </div>

          {/* Content */}
          <div className={`text-sm md:text-base leading-relaxed ${isUser ? 'text-[#00f0ff]' : 'text-[#fcee0a]'}`}>
             <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !String(children).includes('\n');
                  
                  if (isInline) {
                     return (
                      <code className="bg-[#ff003c]/20 px-1 py-0.5 text-[#ff003c] font-mono text-sm" {...props}>
                        {children}
                      </code>
                     )
                  }

                  return (
                    <div className="my-4 border border-[#333] bg-[#050505] relative group">
                      <div className="absolute top-0 right-0 bg-[#333] px-2 py-0.5 text-[9px] text-white uppercase font-mono">
                         {match ? match[1] : 'SHARD_DATA'}
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                p: ({ children }) => <p className="mb-3">{children}</p>,
                strong: ({ children }) => <span className="font-bold text-white bg-[#fcee0a]/20 px-1">{children}</span>,
                ul: ({ children }) => <ul className="list-square list-inside mb-3 space-y-1 text-gray-300 marker:text-[#ff003c]">{children}</ul>,
                li: ({ children }) => <li className="pl-1 inline-block">{children}</li>,
                h1: ({ children }) => <h1 className="text-2xl font-black mb-3 text-white uppercase italic">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-2 text-[#00f0ff] uppercase">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-[#ff003c] uppercase">{children}</h3>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-[#ff003c] pl-4 italic text-gray-400 my-2">{children}</blockquote>
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className={`absolute bottom-0 ${isUser ? 'left-0' : 'right-0'} w-4 h-4 border-b-2 border-r-2 ${isUser ? 'border-[#00f0ff]' : 'border-[#fcee0a]'} opacity-50`}></div>
      </div>
    </div>
  );
};

export default MessageBubble;