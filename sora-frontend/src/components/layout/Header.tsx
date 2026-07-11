import { Button } from "@/components/ui/button"

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" className={className}>
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,61.95.54,90.27a105.73,105.73,0,0,0,32.29,16.1,77.7,77.7,0,0,0,6.89-11.1,82.59,82.59,0,0,1-11.1-5.18c.9-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a83.31,83.31,0,0,1-11.1,5.18,77.91,77.91,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.32-16.11C129.24,58.06,122.22,29.35,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  )
}

// O Header agora recebe as funções para trocar o idioma
interface HeaderProps {
  lang: "en" | "pt";
  setLang: (lang: "en" | "pt") => void;
}

export function Header({ lang, setLang }: HeaderProps) {
  return (
    <header className="absolute top-0 w-full z-50 bg-transparent pt-6">
      <div className="container mx-auto flex items-center justify-end px-4 md:px-8 gap-6">
        
        {/* Seletor de Idioma Minimalista */}
        <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-zinc-600 pointer-events-auto">
          <button 
            onClick={() => setLang('en')}
            className={`transition-colors duration-300 hover:text-white ${lang === 'en' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}
          >
            EN
          </button>
          <span className="opacity-30">|</span>
          <button 
            onClick={() => setLang('pt')}
            className={`transition-colors duration-300 hover:text-white ${lang === 'pt' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}
          >
            PT
          </button>
        </div>

        {/* Botão do Discord com Link Oficial */}
        <a 
          href="https://discord.gg/9yj4c99z9g" 
          target="_blank" 
          rel="noopener noreferrer"
          className="pointer-events-auto"
        >
          <Button className="bg-transparent text-white font-semibold px-5 border-0 hover:bg-white/10 transition-all duration-300 flex gap-2 rounded-full shadow-none">
            <DiscordIcon className="h-4 w-4" />
            Discord
          </Button>
        </a>
        
      </div>
    </header>
  )
}