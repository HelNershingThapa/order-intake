import { Card, CardContent } from "@/components/ui/card";

import {
  Building2,
  ShoppingCart,
  Truck,
  MapPin,
  BarChart3,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Route360
              <span className="block text-3xl lg:text-4xl text-primary font-normal mt-2">
                Order Creation Portal
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up">
              Streamline your logistics operations with our comprehensive order
              intake and validation system. Perfect for vendors and
              administrators managing delivery workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <Link href="/admin/login">
                <Button className="w-full sm:w-auto">
                  <Building2 className="mr-2 h-5 w-5" />
                  Admin Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/vendor/login">
                <Button className="w-full sm:w-auto">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Vendor Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powerful Features for Modern Logistics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage orders efficiently, from single
              entries to bulk uploads with intelligent address validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gradient-card border-border/50 hover:shadow-medium transition-all hover:scale-[1.02] group"
              >
                <CardContent className="p-6">
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Simple Three-Step Process
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes with our intuitive workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="rounded-full bg-primary text-primary-foreground w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-primary">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Route360</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Professional order management portal for logistics operations
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">
                Admin Access
              </Button>
            </Link>
            <Link href="/vendor/login">
              <Button variant="ghost" size="sm">
                Vendor Access
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: ShoppingCart,
    title: "Single Order Entry",
    description:
      "Create individual orders with smart address validation and geocoding capabilities.",
  },
  {
    icon: Truck,
    title: "Bulk CSV Upload",
    description:
      "Process hundreds of orders at once with intelligent error detection and repair tools.",
  },
  {
    icon: MapPin,
    title: "Smart Address Validation",
    description:
      "Automatic geocoding with manual pin-drop capabilities for unresolved addresses.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track order statistics, geocoding rates, and operational insights on your dashboard.",
  },
  {
    icon: Building2,
    title: "Vendor Management",
    description:
      "Admin tools to create and manage vendor accounts with secure API key authentication.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description:
      "API key-based authentication ensures secure access to vendor-specific data and operations.",
  },
];

const process = [
  {
    title: "Login & Access",
    description:
      "Use your admin credentials or vendor API key to access your dedicated portal.",
  },
  {
    title: "Create or Upload",
    description:
      "Add single orders through forms or upload bulk CSV files with automatic validation.",
  },
  {
    title: "Validate & Submit",
    description:
      "Review geocoding results, fix any address issues, and submit orders to Route360.",
  },
];

export default Index;
