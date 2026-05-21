import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How can crypto work without internet?",
    answer: "BLOOB uses SMS relay technology. When you lose data coverage, your transactions are securely signed locally on your device and sent via a standard SMS message to our global relay network, which then broadcasts it to the blockchain."
  },
  {
    question: "Is SMS mode secure?",
    answer: "Yes. The SMS only contains a pre-signed, cryptographically secure transaction hash. It does not contain your private keys or seed phrase. The relay node can only broadcast what you've explicitly authorized."
  },
  {
    question: "Which assets are supported?",
    answer: "Currently, BLOOB supports all major assets on the Base network including ETH, USDC, and native Base tokens. We are expanding to Ethereum, BNB Chain, and Solana soon."
  },
  {
    question: "What if SMS fails?",
    answer: "BLOOB has a built-in auto-retry mechanism. If an SMS fails to send, it will queue the transaction and try again automatically, or fallback to an alternate relay number in your region."
  },
  {
    question: "Do I need registration?",
    answer: "No. BLOOB is entirely self-custodial and permissionless. There are no accounts, no KYC, and no email signups required to use the core wallet features."
  },
  {
    question: "What makes BLOOB different?",
    answer: "Most wallets assume you have perfect 5G everywhere. BLOOB is built for the real world, ensuring you can manage your assets whether you're in a downtown high-rise or a remote area with only 2G cellular coverage."
  }
];

export default function Faq() {
  return (
    <section className="py-24" id="faq">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-bold tracking-widest uppercase mb-4"
          >
            FAQ
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Questions people <br />
            ask most.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-white/5 rounded-2xl px-6 data-[state=open]:border-primary/30 transition-colors">
                <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary py-6 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

      </div>
    </section>
  );
}