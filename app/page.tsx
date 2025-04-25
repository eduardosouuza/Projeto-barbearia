"use client"

import Link from "next/link"
import { Scissors, Star, Clock, MapPin, Phone, Instagram, Facebook, Twitter, Calendar, Menu, X, HomeIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/scroll-animation"
import { BackgroundImage } from "@/components/background-image"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("home")

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Efeito para animar elementos no scroll
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll')
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    
    fadeElements.forEach((element) => {
      observer.observe(element)
    })
    
    return () => {
      fadeElements.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen dark">
      <header className={`border-b border-purple-900/20 transition-all duration-500 sticky top-0 z-50 ${isScrolled ? 'navbar-sticky py-2' : 'bg-black/90 py-4'}`}>
        <div className="container flex items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-full bg-purple-600/20 group-hover:bg-purple-600/30 transition-all duration-300">
              <Scissors className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold text-gradient">BarberStyle</span>
          </Link>
          
          {/* Menu Desktop com animações de hover e underline */}
          <nav className="hidden md:flex gap-8">
            {[
              { name: "Home", href: "/", id: "home" },
              { name: "Serviços", href: "/services", id: "services" },
              { name: "Agendar", href: "/booking", id: "booking" },
              { name: "Contato", href: "/contact", id: "contact" }
            ].map((link) => (
              <Link 
                key={link.id}
                href={link.href} 
                className="imperial-nav-link text-sm font-medium text-white hover:text-purple-400 transition-colors px-2 py-2"
                onClick={() => setActiveLink(link.id)}
              >
                {link.name}
                <span className={activeLink === link.id ? "w-full" : ""}></span>
              </Link>
            ))}
          </nav>
          
          {/* Botões Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/booking">
              <Button className="imperial-button flex items-center gap-2 px-5 py-6 rounded-full text-white">
                <Calendar className="w-4 h-4" />
                <span>Agendar Horário</span>
              </Button>
            </Link>
            <Link 
              href="/login" 
              className="text-sm text-purple-400 hover:text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-900/20 transition-all duration-300"
            >
              Admin
            </Link>
          </div>
          
          {/* Botão Menu Mobile */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white rounded-full bg-purple-900/20 hover:bg-purple-900/40 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Menu Mobile com animações */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-black/95 backdrop-blur-lg border-t border-purple-900/20 overflow-hidden"
            >
              <nav className="container flex flex-col px-4 py-4">
                {[
                  { name: "Home", href: "/", icon: <HomeIcon className="h-4 w-4" /> },
                  { name: "Serviços", href: "/services", icon: <Scissors className="h-4 w-4" /> },
                  { name: "Agendar", href: "/booking", icon: <Calendar className="h-4 w-4" /> },
                  { name: "Contato", href: "/contact", icon: <Phone className="h-4 w-4" /> }
                ].map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-3 text-sm font-medium text-white hover:text-purple-400 transition-colors p-4 rounded-lg hover:bg-purple-900/20 mb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="p-2 rounded-full bg-purple-900/20">
                        {link.icon}
                      </div>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="pt-4 border-t border-purple-900/20 flex flex-col gap-4 mt-2"
                >
                  <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="imperial-button w-full flex items-center justify-center gap-2 p-6 text-white">
                      <Calendar className="w-4 h-4" />
                      Agendar Horário
                    </Button>
                  </Link>
                  <Link 
                    href="/login" 
                    className="text-sm text-purple-400 hover:text-purple-300 p-4 rounded-lg hover:bg-purple-900/20 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1">
        {/* Hero Section - Melhorada */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 relative overflow-hidden">
          {/* Imagem de fundo com carregamento otimizado */}
          <BackgroundImage src="/images/barbershop-bg.jpg" lowResSrc="/images/barbershop-bg-low.jpg" />
          <div className="absolute inset-0 hero-gradient z-10"></div>

          {/* Elementos decorativos */}
          <motion.div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.div
            className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-purple-800/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1,
            }}
          />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                className="p-6 rounded-lg max-w-3xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-4 inline-block p-2 bg-purple-600/30 rounded-full backdrop-blur-sm">
                  <Scissors className="h-10 w-10 text-purple-400" />
                </div>
                <h2 className="text-5xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white drop-shadow-lg text-glow">
                  Estilo e <span className="text-gradient">Precisão</span> a Cada Corte
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl mt-6 drop-shadow">
                  Agende seu horário na melhor barbearia da cidade. Serviços de qualidade com profissionais experientes.
                </p>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Link href="/services">
                    <Button
                      className="w-full border-purple-400 text-purple-400 hover:bg-purple-500/20 backdrop-blur-sm"
                      variant="outline"
                      size="lg"
                    >
                      Nossos Serviços
                    </Button>
                  </Link>
                  <Link href="/booking">
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/30 button-glow"
                      size="lg"
                    >
                      Agendar Agora
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Informações Rápidas */}
        <section className="w-full py-8 bg-black">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScrollAnimation direction="left">
                <div className="flex items-center justify-center p-6 rounded-lg bg-gray-900 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5 card-hover">
                  <Clock className="h-8 w-8 text-purple-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Horário de Funcionamento</h3>
                    <p className="text-gray-300">Seg - Sáb: 9h às 20h</p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.2}>
                <div className="flex items-center justify-center p-6 rounded-lg bg-gray-900 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5 card-hover">
                  <MapPin className="h-8 w-8 text-purple-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Localização</h3>
                    <p className="text-gray-300">Av. Principal, 123 - Centro</p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" delay={0.4}>
                <div className="flex items-center justify-center p-6 rounded-lg bg-gray-900 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5 card-hover">
                  <Phone className="h-8 w-8 text-purple-500 mr-4 flex-shrink-0" />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-white">Contato</h3>
                    <p className="text-gray-300">Agende pelo WhatsApp</p>
                    <a 
                      href="https://wa.me/5511999999999" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-400 hover:text-purple-300 transition-colors mt-1"
                    >
                      (11) 99999-9999
                    </a>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black to-gray-900">
          <div className="container px-4 md:px-6">
            <ScrollAnimation>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block p-2 bg-purple-600/20 rounded-full mb-4">
                    <Scissors className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white text-glow">
                    Nossos <span className="text-purple-400">Serviços</span>
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                    Oferecemos uma variedade de serviços para atender às suas necessidades.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <ScrollAnimation direction="left" delay={0.1}>
                <div className="flex flex-col items-center space-y-4 border border-purple-900/30 p-8 rounded-lg bg-gray-800 hover:translate-y-[-5px] transition-transform duration-300 shadow-lg shadow-purple-900/5 card-hover">
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    <Scissors className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Corte de Cabelo</h3>
                  <p className="text-gray-300 text-center">Cortes modernos e clássicos para todos os estilos.</p>
                  <div className="flex items-center text-yellow-400 space-x-1 mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="font-bold text-2xl text-purple-500 mt-2">R$ 45,00</p>
                  <Link href="/booking?service=1" className="w-full">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4 button-glow">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar
                    </Button>
                  </Link>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.3}>
                <div className="flex flex-col items-center space-y-4 border border-purple-900/30 p-8 rounded-lg bg-gray-800 hover:translate-y-[-5px] transition-transform duration-300 shadow-lg shadow-purple-900/5 card-hover">
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    <Scissors className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Barba</h3>
                  <p className="text-gray-300 text-center">Modelagem e aparagem de barba com toalha quente.</p>
                  <div className="flex items-center text-yellow-400 space-x-1 mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="font-bold text-2xl text-purple-500 mt-2">R$ 35,00</p>
                  <Link href="/booking?service=2" className="w-full">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4 button-glow">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar
                    </Button>
                  </Link>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" delay={0.5}>
                <div className="flex flex-col items-center space-y-4 border border-purple-900/30 p-8 rounded-lg bg-gray-800 hover:translate-y-[-5px] transition-transform duration-300 shadow-lg shadow-purple-900/5 card-hover">
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    <Scissors className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Combo</h3>
                  <p className="text-gray-300 text-center">Corte de cabelo + barba com desconto especial.</p>
                  <div className="flex items-center text-yellow-400 space-x-1 mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm line-through text-gray-400">R$ 80,00</span>
                    <p className="font-bold text-2xl text-purple-500">R$ 70,00</p>
                  </div>
                  <Link href="/booking?service=3" className="w-full">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4 button-glow">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar
                    </Button>
                  </Link>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.6} className="md:col-span-3 flex justify-center mt-8">
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
                    size="lg"
                  >
                    Ver Todos os Serviços
                  </Button>
                </Link>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Galeria de Fotos */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6">
            <ScrollAnimation>
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white text-glow">
                    Nossa <span className="text-purple-400">Galeria</span>
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                    Confira alguns dos nossos melhores trabalhos
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="grid gap-4">
                <ScrollAnimation direction="left">
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Corte moderno"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
                <ScrollAnimation direction="left" delay={0.2}>
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Barba estilizada"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
              </div>

              <div className="grid gap-4">
                <ScrollAnimation direction="left" delay={0.3}>
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Corte degradê"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
                <ScrollAnimation direction="left" delay={0.4}>
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Ambiente da barbearia"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
              </div>

              <div className="grid gap-4">
                <ScrollAnimation direction="right" delay={0.3}>
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Corte clássico"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
                <ScrollAnimation direction="right" delay={0.4}>
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Barba completa"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
              </div>

              <div className="grid gap-4">
                <ScrollAnimation direction="right" delay={0.1}>
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Corte moderno"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
                <ScrollAnimation direction="right" delay={0.2}>
                  <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/10 image-zoom">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Ambiente da barbearia"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
          <div className="container px-4 md:px-6">
            <ScrollAnimation>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                    O Que Nossos Clientes Dizem
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                    Confira os depoimentos de quem já experimentou nossos serviços
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <ScrollAnimation direction="left" delay={0.1}>
                <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-gray-800 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Cliente"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center text-yellow-400 space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="text-gray-300 text-center italic">
                    "Melhor barbearia da cidade! Atendimento excelente e resultado impecável. Recomendo a todos."
                  </p>
                  <h4 className="text-lg font-bold text-white">João Silva</h4>
                  <p className="text-sm text-gray-400">Cliente desde 2020</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.3}>
                <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-gray-800 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Cliente"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center text-yellow-400 space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="text-gray-300 text-center italic">
                    "Profissionais muito capacitados e ambiente super agradável. Minha barba nunca ficou tão boa!"
                  </p>
                  <h4 className="text-lg font-bold text-white">Carlos Oliveira</h4>
                  <p className="text-sm text-gray-400">Cliente desde 2021</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" delay={0.5}>
                <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-gray-800 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Cliente"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center text-yellow-400 space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="text-gray-300 text-center italic">
                    "Atendimento pontual e serviço de primeira qualidade. O sistema de agendamento online é muito
                    prático!"
                  </p>
                  <h4 className="text-lg font-bold text-white">Pedro Santos</h4>
                  <p className="text-sm text-gray-400">Cliente desde 2022</p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Por que nos escolher */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black to-gray-900">
          <div className="container px-4 md:px-6">
            <ScrollAnimation>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                    Por que nos escolher?
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                    Conheça as vantagens de ser nosso cliente.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <ScrollAnimation direction="left" delay={0.1}>
                <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-gray-800 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5">
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-purple-500"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Profissionais Experientes</h3>
                  <p className="text-gray-300 text-center">
                    Nossa equipe é formada por barbeiros com anos de experiência no mercado.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.3}>
                <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-gray-800 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5">
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-purple-500"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Ambiente Confortável</h3>
                  <p className="text-gray-300 text-center">
                    Um espaço moderno e aconchegante para você relaxar enquanto é atendido.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" delay={0.5}>
                <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-gray-800 border border-purple-900/20 hover:border-purple-500/30 transition-colors shadow-lg shadow-purple-900/5">
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-purple-500"
                    >
                      <path d="M12 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v-4h2a2 2 0 0 0 0-4Z" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Produtos de Qualidade</h3>
                  <p className="text-gray-300 text-center">
                    Utilizamos apenas produtos de alta qualidade para garantir o melhor resultado.
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 md:py-28 bg-gradient-to-br from-black via-gray-900 to-purple-950/70 relative">
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <ScrollAnimation>
              <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto fade-in-on-scroll">
                <div className="inline-block p-3 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-500/20">
                  <Scissors className="h-8 w-8 text-purple-400" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-glow">
                    Pronto para um <span className="text-gradient">novo visual</span>?
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl font-light">
                    Agende seu horário agora e experimente o melhor serviço de barbearia da cidade.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mt-4">
                  <Link href="/booking" className="w-full">
                    <Button className="imperial-button w-full rounded-full py-6 text-white group transition-all duration-500">
                      <span className="flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Agendar Horário</span>
                      </span>
                    </Button>
                  </Link>
                  <Link href="/contact" className="w-full">
                    <Button 
                      variant="outline"
                      className="w-full rounded-full py-6 bg-transparent border-2 border-purple-400 text-purple-300 hover:bg-purple-950/30 hover:border-purple-300 hover:text-purple-200 group transition-all duration-300"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Fale Conosco</span>
                      </span>
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8 p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/10">
                  <div className="flex -space-x-4">
                    {[
                      {initials: "JS", colors: "from-purple-500 to-indigo-600"},
                      {initials: "MC", colors: "from-indigo-500 to-blue-600"},
                      {initials: "PL", colors: "from-blue-500 to-cyan-600"},
                      {initials: "RO", colors: "from-cyan-500 to-purple-600"}
                    ].map((user, i) => (
                      <div 
                        key={user.initials} 
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.colors} border-2 border-gray-900 shadow-lg flex items-center justify-center text-white font-semibold text-sm transform transition-all hover:scale-105 hover:z-10`}
                        style={{ transform: `translateX(${i * 5}px)` }}
                      >
                        {user.initials}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-purple-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-purple-200 text-sm font-medium">5.0</span>
                    </div>
                    <p className="text-white text-sm sm:text-base font-medium mt-1">+2.500 clientes satisfeitos</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <footer className="border-t border-purple-900/20 py-8 md:py-12 bg-black">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Scissors className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white text-glow">BarberStyle</span>
              </div>
              <p className="text-gray-300">Oferecendo serviços de barbearia de alta qualidade desde 2015.</p>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-purple-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-purple-500 transition-colors">
                    Serviços
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-gray-300 hover:text-purple-500 transition-colors">
                    Agendar
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-purple-500 transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Contato</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                  Av. Principal, 123 - Centro
                </li>
                <li className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2 text-purple-500" />
                  (11) 99999-9999
                </li>
                <li className="flex items-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-purple-500"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  contato@barberstyle.com
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Redes Sociais</h3>
              <div className="flex gap-4">
                <Link href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-purple-900/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-sm text-gray-300 md:text-left">
              &copy; {new Date().getFullYear()} BarberStyle. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-300 hover:text-purple-500 transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-sm text-gray-300 hover:text-purple-500 transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
