import { useState, useEffect } from "react"

export function ErasingText({ phrases }: { phrases: string[] }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState(phrases[0])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setPhraseIndex(0)
    setText(phrases[0])
    setIsDeleting(false)
  }, [phrases])

  useEffect(() => {
    // CORREÇÃO AQUI: Em vez de NodeJS.Timeout, usamos o ReturnType dinâmico
    let timeout: ReturnType<typeof setTimeout> 
    
    const currentPhrase = phrases[phraseIndex] || phrases[0]

    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 3000)
    } else if (isDeleting && text === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
      }, 500)
    } else {
      const speed = isDeleting ? 80 : 120
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + (isDeleting ? -1 : 1)))
      }, speed)
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex, phrases])

  return (
    <span className="bg-gradient-to-r from-sky-400 to-sky-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500 ease-out group-hover:from-transparent group-hover:to-transparent group-hover:[-webkit-text-stroke:1.5px_#0ea5e9] group-hover:drop-shadow-none">
      {text === "" ? "\u200B" : text}
    </span>
  )
}