import Link from "next/link";
import { Database, Zap, BarChart3, Key, Clock, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Database,
    title: "Redis-Like Interface",
    description: "Familiar key-value caching with a modern UI. Set, get, delete, and browse your cache with ease.",
  },
  {
    icon: Clock,
    title: "TTL Management",
    description: "Set expiration times on cache entries. Auto-cleanup of stale data keeps your cache fresh.",
  },
  {
    icon: Trash2,
    title: "Cache Invalidation",
    description: "Pattern-based invalidation, bulk delete, and namespace clearing for precise cache control.",
  },
  {
    icon: BarChart3,
    title: "Hit/Miss Analytics",
    description: "Real-time metrics on cache performance. Track hit rates, response times, and usage patterns.",
  },
  {
    icon: Key,
    title: "Key Browser",
    description: "Search, filter, and explore your cache keys. See values, metadata, and expiration at a glance.",
  },
  {
    icon: Zap,
    title: "Memory Stats",
    description: "Monitor memory usage across stores. Set limits and get alerts before you run out of space.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For personal projects",
    features: ["1 cache store", "100 keys max", "Basic analytics", "24h data retention"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$14",
    period: "/month",
    description: "For growing applications",
    features: [
      "Unlimited cache stores",
      "Unlimited keys",
      "Advanced analytics",
      "30-day data retention",
      "API access",
      "Pattern invalidation",
      "Memory alerts",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Craig-O-Cache</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Now in Public Beta
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Caching Made Simple
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A Redis-like caching layer manager with TTL management, cache invalidation, 
          hit/miss analytics, key browser, and memory usage stats.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <Database className="h-5 w-5" />
              Open Dashboard
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
          <div>
            <div className="text-4xl font-bold text-primary">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">&lt;1ms</div>
            <div className="text-muted-foreground">Latency</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">10M+</div>
            <div className="text-muted-foreground">Keys Cached</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful caching features wrapped in a beautiful, intuitive interface.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more power.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-primary shadow-lg shadow-primary/20" : "border-border/50"}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Craig-O-Cache</span>
          </div>
          <p>&copy; 2025 Craig-O-Cache. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}
