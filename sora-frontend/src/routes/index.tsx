import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { ParticlesBackground } from "@/components/layout/ParticlesBackground"
import { ErasingText } from "@/components/ui/ErasingText"

// Ensina ao TypeScript que o script do SellAuth existe na janela do navegador
declare global {
  interface Window {
    sellAuthEmbed?: {
      checkout: (element: HTMLElement | null, options: any) => void;
    }
  }
}

const content = {
  en: {
    badge: "sora v2.0 undetected",
    title1: "hardware protection.",
    animatedPhrases: ["no traces.", "Sora Spoofer."],
    descriptionLine1: "The safest kernel-level spoofer on the market.",
    descriptionLine2: "Play with total privacy, without reinstalling Windows or risking detection.",
    buttonBuy: "Buy Now · $25",
  },
  pt: {
    badge: "sora v2.0 undetected",
    title1: "proteção de hardware.",
    animatedPhrases: ["sem rastros.", "Sora Spoofer."],
    descriptionLine1: "O spoofer kernel-level mais seguro do mercado.",
    descriptionLine2: "Jogue com total privacidade, sem reinstalar o Windows ou correr riscos de detecção.",
    buttonBuy: "Comprar Agora · R$127",
  }
}

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const [lang, setLang] = useState<"en" | "pt">("en") 
  const t = content[lang] 

  const handleBuyClick = () => {
    if (window.sellAuthEmbed) {
      // Dispara o modal ignorando re-renderizações do React
      window.sellAuthEmbed.checkout(null, {
        cart: [{ productId: 788439, variantId: 1331384, quantity: 1 }], 
        shopId: 251950, 
        modal: true
      });
    } else {
      console.warn("Script de pagamento ainda não carregou.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      
      <ParticlesBackground />
      
      <Header lang={lang} setLang={setLang} />

      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        <main className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center">
          
          <div className="pointer-events-auto flex flex-col items-center">
            
            <div className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-300 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-sky-500 mr-2 animate-pulse"></span>
              {t.badge}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 group cursor-default">
              <span className="text-white transition-all duration-500 ease-out group-hover:text-transparent group-hover:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)]">
                {t.title1}
              </span>
              <br/>
              <ErasingText phrases={t.animatedPhrases} />
            </h1>
            
            <p className="text-zinc-400 max-w-3xl w-full text-lg mb-10 mx-auto">
              {t.descriptionLine1}
              <br/>
              {t.descriptionLine2}
            </p>

            <Button 
              onClick={handleBuyClick}
              className="relative overflow-hidden font-bold px-10 h-14 text-lg border-0 transition-colors duration-300 rounded-full flex items-center justify-center min-w-[280px] bg-white text-zinc-950 hover:bg-transparent hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-none"
            >
              <span className="relative z-10 flex items-center">
                {t.buttonBuy}
              </span>
            </Button>
            
          </div>
        </main>
      </div>
    </div>
  )
}