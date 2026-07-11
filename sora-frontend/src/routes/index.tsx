import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { ParticlesBackground } from "@/components/layout/ParticlesBackground"
import { ErasingText } from "@/components/ui/ErasingText"

// Ensina ao TypeScript que o script do SellAuth vai existir na janela do navegador
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

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [fillWidth, setFillWidth] = useState("0%")
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // 1. Injeta o motor oficial do SellAuth silenciosamente quando a página carrega
  useEffect(() => {
    const scriptId = 'sellauth-embed-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = "https://sellauth.com/assets/js/sellauth-embed-2.js"
      script.async = true
      script.onload = () => setScriptLoaded(true)
      document.body.appendChild(script)
    } else {
      setScriptLoaded(true)
    }
  }, [])

  const handleBuyClick = () => {
    if (!scriptLoaded || !window.sellAuthEmbed) {
      console.warn("Aguarde, o script de pagamento ainda está carregando...")
      return
    }

    setIsCheckoutLoading(true)
    setTimeout(() => setFillWidth("100%"), 10)

    // 2. Dispara o checkout nativo ignorando o React
    window.sellAuthEmbed.checkout(null, {
      cart: [{ productId: 788439, variantId: 1331384, quantity: 1 }], // Coloque seus IDs aqui
      shopId: 251950, // Coloque seu Shop ID aqui
      modal: true
    })

    // Reseta a animação do botão após o modal abrir, para o caso do usuário fechar
    setTimeout(() => {
      setIsCheckoutLoading(false)
      setFillWidth("0%")
    }, 2500)
  }

  const internalParticles = [
    { top: "20%", left: "12%", size: 3, delay: "0s", duration: "1.4s" },
    { top: "65%", left: "22%", size: 5, delay: "0.3s", duration: "2s" },
    { top: "35%", left: "38%", size: 4, delay: "0.1s", duration: "1.6s" },
    { top: "70%", left: "52%", size: 3, delay: "0.5s", duration: "1.2s" },
    { top: "25%", left: "68%", size: 6, delay: "0.2s", duration: "2.2s" },
    { top: "60%", left: "78%", size: 4, delay: "0.7s", duration: "1.5s" },
    { top: "40%", left: "88%", size: 3, delay: "0.4s", duration: "1.8s" },
  ]

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
              disabled={isCheckoutLoading}
              className={`relative overflow-hidden font-bold px-10 h-14 text-lg border-0 transition-colors duration-300 rounded-full flex items-center justify-center min-w-[280px]
                ${isCheckoutLoading 
                  ? "bg-transparent text-white cursor-not-allowed shadow-none" 
                  : "bg-white text-zinc-950 hover:bg-transparent hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-none"
                }`}
            >
              {(isCheckoutLoading || fillWidth !== "0%") && (
                <div 
                  className="absolute top-0 left-0 h-full bg-sky-500/10 z-0 overflow-hidden"
                  style={{ width: fillWidth, transition: "width 2.5s linear" }}
                >
                  <div className="absolute top-0 left-0 h-full w-[280px]">
                    {internalParticles.map((p, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-sky-400 opacity-75 animate-pulse"
                        style={{
                          top: p.top, left: p.left, width: `${p.size}px`, height: `${p.size}px`,
                          animationDelay: p.delay, animationDuration: p.duration,
                          boxShadow: "0 0 8px rgba(56, 189, 248, 0.6)"
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

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