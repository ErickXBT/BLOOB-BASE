import { motion } from "framer-motion";
import { Bot, Sparkles, MessageSquare } from "lucide-react";

export default function AiAssistant() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Chat UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="bg-card border border-white/10 rounded-[2rem] p-4 shadow-2xl shadow-black/50">
              <div className="bg-black rounded-3xl p-6 h-[500px] flex flex-col relative overflow-hidden border border-white/5">
                
                {/* Header */}
                <div className="flex items-center gap-3 pb-6 border-b border-white/5 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">BLOOB AI</h4>
                    <span className="text-xs text-primary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Online
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                  
                  {/* Message 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="self-end bg-primary/20 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm border border-primary/20"
                  >
                    Swap 20 USDC for Base ETH
                  </motion.div>
                  
                  {/* Response 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="self-start bg-white/5 text-gray-300 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm border border-white/5"
                  >
                    Found the best route via Uniswap.
                    <div className="mt-2 bg-black/50 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span>20.00 USDC</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-primary font-bold">~0.0062 ETH</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-2">
                        <span>Fee: $0.02</span>
                        <button className="bg-primary/20 text-primary px-2 py-1 rounded">Confirm</button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Message 2 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.5 }}
                    className="self-end bg-primary/20 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm border border-primary/20 mt-2"
                  >
                    Send $50 to @alex
                  </motion.div>

                  {/* Response 2 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.0 }}
                    className="self-start bg-white/5 text-gray-300 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm border border-white/5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-white">Transaction Confirmed</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Sent 50 USDC to alex.base.eth on Base network.</span>
                  </motion.div>

                </div>

                {/* Input area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
                  <div className="bg-white/10 rounded-full flex items-center px-4 py-3 border border-white/10">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mr-3" />
                    <span className="text-sm text-muted-foreground">Ask BLOOB...</span>
                    <Sparkles className="w-4 h-4 text-primary ml-auto" />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Right: Copy */}
          <div className="flex-1 lg:pl-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8"
            >
              Stop typing addresses. <br />
              <span className="text-primary">Just talk.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground mb-10 max-w-lg"
            >
              Meet your intelligent on-chain companion. BLOOB AI understands plain english commands, finds the best routes, and executes complex transactions with one tap.
            </motion.p>
            
            <div className="flex flex-wrap gap-3">
              {[
                "Swap 100 USDC for ETH", 
                "What's the gas fee right now?", 
                "Send 50 OP to vitalik.eth", 
                "Stake my available SOL"
              ].map((cmd, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="px-4 py-2 rounded-full border border-white/10 bg-card hover:bg-white/5 hover:border-primary/50 transition-colors cursor-pointer text-sm font-medium"
                >
                  "{cmd}"
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Simple Arrow icon since we can't import easily in the middle of JSX sometimes
function ArrowRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}