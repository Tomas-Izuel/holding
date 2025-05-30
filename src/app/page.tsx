import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Shield,
  BarChart3,
  Clock,
  DollarSign,
  PieChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,_transparent_50%)] opacity-10 pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/HoldIn-colorized.svg"
              alt="Holding logo"
              width={120}
              height={60}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Cómo funciona
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Precios
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
              asChild
            >
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Plataforma de nueva generación
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Monitorea tus
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                inversiones
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                en tiempo real
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Registra y rastrea tus{" "}
              <span className="text-primary font-semibold">
                stocks, bonos, CEDEARs y criptomonedas
              </span>
              . Obtén análisis automáticos y mantente al día con el valor de tu
              portfolio.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 text-lg px-8 py-6 group"
                asChild
              >
                <Link href="/register" className="flex items-center gap-2">
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5 text-lg px-8 py-6 backdrop-blur-sm"
                asChild
              >
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Todo lo que necesitas para gestionar
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                tus inversiones
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Una plataforma completa para el seguimiento y análisis de tu
              portfolio de inversiones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Tracking Automático",
                description:
                  "Seguimiento semanal automático de precios mediante scraping de datos en tiempo real",
              },
              {
                icon: PieChart,
                title: "Portfolio Diversificado",
                description:
                  "Registra stocks, bonos, CEDEARs, criptomonedas y más en una sola plataforma",
              },
              {
                icon: TrendingUp,
                title: "Análisis Inteligente",
                description:
                  "Obtén insights y análisis detallados sobre el rendimiento de tus inversiones",
              },
              {
                icon: Clock,
                title: "Actualizaciones Semanales",
                description:
                  "Recibe actualizaciones automáticas de precios cada semana sin intervención manual",
              },
              {
                icon: Shield,
                title: "Datos Seguros",
                description:
                  "Tus datos de inversión están protegidos con los más altos estándares de seguridad",
              },
              {
                icon: DollarSign,
                title: "Rentabilidad Clara",
                description:
                  "Visualiza fácilmente las ganancias y pérdidas de cada inversión en tu portfolio",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                <CardHeader className="relative">
                  <div className="relative mb-4">
                    <feature.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Cómo funciona
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Holding
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tres simples pasos para comenzar a monitorear tus inversiones
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Registra tus inversiones",
                description:
                  "Agrega todas tus compras de stocks, bonos, CEDEARs y criptomonedas a la plataforma",
              },
              {
                step: "2",
                title: "Monitoreo automático",
                description:
                  "Nuestro sistema actualiza los precios semanalmente mediante scraping de datos",
              },
              {
                step: "3",
                title: "Analiza y decide",
                description:
                  "Recibe análisis detallados y toma decisiones informadas sobre tu portfolio",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8 mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-10" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                ¿Listo para optimizar
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                tus inversiones?
              </span>
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto text-muted-foreground leading-relaxed">
              Únete a miles de inversores que ya confían en Holding para
              gestionar su portfolio
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 text-lg px-8 py-6 group"
                asChild
              >
                <Link href="/register" className="flex items-center gap-2">
                  Crear cuenta gratis
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5 text-lg px-8 py-6 backdrop-blur-sm"
                asChild
              >
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-16 mt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Holding
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                La plataforma más completa para el seguimiento y análisis de
                inversiones.
              </p>
            </div>

            {[
              {
                title: "Producto",
                links: [
                  { name: "Características", href: "#features" },
                  { name: "Cómo funciona", href: "#how-it-works" },
                  { name: "Precios", href: "#pricing" },
                ],
              },
              {
                title: "Soporte",
                links: [
                  { name: "Centro de ayuda", href: "/help" },
                  { name: "Contacto", href: "/contact" },
                  { name: "Documentación", href: "/docs" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacidad", href: "/privacy" },
                  { name: "Términos", href: "/terms" },
                  { name: "Cookies", href: "/cookies" },
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-6 text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; 2024 Holding. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
