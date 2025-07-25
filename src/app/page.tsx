"use client";

import * as React from "react";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, 
  Users, 
  BarChart3, 
  CheckCircle, 
  LogIn, 
  BookOpenCheck, 
  Sparkles,
  Coffee,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// A wrapper component for consistent section styling
// FIX: Added 'id' to the component's props to resolve TypeScript errors.
const SectionWrapper = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`w-full py-20 lg:py-28 ${className}`}>
    <div className="container px-6 md:px-8">
      {children}
    </div>
  </section>
);

// --- Mode Toggle Component ---
function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}


// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3">
            <Image 
              src="/English Course Scheduler ico.png" 
              alt="Devoteam Logo" 
              width={110} 
              height={88}
              className="rounded-md"
              priority
            />
            <p className="font-bold text-lg hidden sm:block text-foreground">
              Devoteam Course Scheduler
            </p>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 ">
            <ModeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Log In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-20 lg:py-32">
          <div className="container px-6 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Devoteam Course Scheduler
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-muted-foreground font-light">
                Elevate Your Skills, <span className="font-semibold text-primary">Together.</span>
              </p>
              <p className="mt-6 text-base leading-relaxed max-w-prose">
                Welcome to your dedicated platform for coordinating and participating in all internal training sessions. This tool simplifies scheduling, ensures optimal group sizes, and fosters collaborative learning across Devoteam.
              </p>
              <div className="mt-8">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button size="lg">Join the Learning Community</Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button size="lg">Explore Sessions</Button>
                  </Link>
                </SignedIn>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <Image 
                src="/devoteam English Course Scheduler Tn.png" 
                alt="Scheduler illustration" 
                width={450} 
                height={450}
                className="rounded-xl shadow-2xl"
              />
            </motion.div>
          </div>
        </section>


                {/* --- NEW: Featured AI Courses Section --- */}
        <SectionWrapper id="featured-courses" className="bg-secondary">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              New! Featured AI Courses
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Expand your skills with our new lineup of Artificial Intelligence training sessions.
            </p>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card for AI 101 */}
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">Introduction to AI - 101</CardTitle>
                    <Badge variant="default">New</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">Get started with the fundamentals of Artificial Intelligence. This session covers key concepts and practical applications.</p>
                  <div className="mt-4 text-sm space-y-2">
                    <p><span className="font-semibold">Instructor:</span> Bedioui Samy</p>
                    <p><span className="font-semibold">Next Session:</span> Friday at 4:00 PM (Tunis Time)</p>
                    <p><span className="font-semibold">Tuesday Session:</span> Coming Soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Card for Prompt Engineering 102 */}
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col border-dashed">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">Prompt Engineering 102</CardTitle>
                    <Badge variant="secondary">New</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">Learn how to craft effective prompts to get the most out of large language models like Gemini.</p>
                  <div className="mt-4 text-sm space-y-2">
                      <p><span className="font-semibold">Instructor:</span> Bedioui Samy</p>
                      <p>Coming Soon..</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Key Features Section */}
        <SectionWrapper id="features" className="bg-secondary">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Key Features Designed for You</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our scheduler is built to make your learning journey effortless and efficient.
            </p>
          </div>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: CalendarDays, title: "Effortless Coordination", description: "Find and book sessions with our intuitive calendar view." },
              { icon: BarChart3, title: "Diverse Course Catalog", description: "Explore courses in Language, AI, Cloud, and more." },
              { icon: Users, title: "Collaborative Insights", description: "See who's attending each session to connect with colleagues." },
              { icon: CheckCircle, title: "Real-time Availability", description: "Live updates on available slots ensure you always find a spot." },
              { icon: LogIn, title: "Devoteam Gmail Integration", description: "Secure and convenient access using your Devoteam account." },
              { icon: Sparkles, title: "Optimized Learning", description: "Small group sizes for personalized attention and effective interaction." }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
        
        {/* How It Works Section */}
        <SectionWrapper id="how-it-works">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Path to Excellence</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Getting started is simple. Follow these easy steps.
                </p>
            </div>
            <div className="relative mt-20">
                {/* The connecting line for desktop */}
                <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-border -translate-x-1/2 hidden md:block" aria-hidden="true"></div>
                
                <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-24">
                  {[
                      { icon: LogIn, title: "Log In Securely", description: "Use your Devoteam Gmail to access the platform." },
                      { icon: CalendarDays, title: "Explore Sessions", description: "Browse courses by your proficiency level." },
                      { icon: BookOpenCheck, title: "Join a Session", description: "Select a time that fits your schedule and reserve your spot." },
                      { icon: Users, title: "Connect & Learn", description: "Enjoy a collaborative experience with your colleagues." }
                  ].map((step, i) => (
                      <motion.div 
                          key={step.title}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.2 }}
                          viewport={{ once: true }}
                          className={`flex flex-col items-center text-center md:flex-row md:text-left ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                      >
                          <div className="flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg z-10 shrink-0">
                              <step.icon className="w-8 h-8"/>
                          </div>
                          <div className="mt-6 md:mt-0 md:mx-6">
                              <h3 className="font-bold text-xl">{step.title}</h3>
                              <p className="mt-2 text-muted-foreground">{step.description}</p>
                          </div>
                      </motion.div>
                  ))}
                </div>
            </div>
        </SectionWrapper>

        {/* Session Timings Section */}
        <SectionWrapper className="bg-secondary">
          <div className="text-center">
            <Coffee className="mx-auto w-12 h-12 text-primary mb-4"/>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Session Timings & Break</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We&rsquo;ve structured the course timings to fit conveniently within your workday.
            </p>
            <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="p-8 bg-card rounded-lg shadow-md border">
                <h3 className="font-bold text-xl">Daily Sessions</h3>
                <p className="mt-2 text-primary font-semibold text-lg">9:00 AM – 6:00 PM</p>
              </div>
              <div className="p-8 bg-card rounded-lg shadow-md border">
                <h3 className="font-bold text-xl">Mid-day Break</h3>
                <p className="mt-2 text-primary font-semibold text-lg">12:30 PM – 1:30 PM</p>
                <p className="text-sm text-muted-foreground">(No sessions scheduled)</p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Testimonials Section */}
        <SectionWrapper id="testimonials">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Colleagues Say</h2>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { quote: "The scheduler made it so easy to find a session that fit my busy schedule. A fantastic tool!", name: "Montassar Abdellaoui", department: "AI Engineer" },
              { quote: "I love being able to see who else is joining. It makes the sessions feel more connected and collaborative.", name: "Jordan Smith", department: "Cloud Services" }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="h-full flex flex-col justify-center p-8 bg-card shadow-lg">
                  <CardContent className="p-0">
                    <blockquote className="text-lg italic border-l-4 border-primary pl-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <p className="mt-6 font-semibold text-right">— {testimonial.name}, <span className="text-muted-foreground font-normal">{testimonial.department}</span></p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Final CTA Section */}
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Grow Your Skills?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join the Devoteam learning community today and take the next step in your professional development.
            </p>
            <div className="mt-8">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="text-lg px-8 py-6">Log In with Devoteam Gmail</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                 <Button size="lg" className="text-lg px-8 py-6">Go to My Dashboard</Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </SectionWrapper>

      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t">
        <div className="container py-8 px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-semibold">Need Assistance?</h3>
              <p className="text-sm text-muted-foreground">
                Contact the HR or Learning & Development team for support.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Devoteam Tunisia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
