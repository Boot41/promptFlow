import React from 'react';
import { ArrowRight, Braces, GitBranch, GitMerge, Workflow, Zap, MessageSquare, SplitSquareVertical, Layers, ChevronRight } from 'lucide-react';
import Navbar from '../components/Lander/Navbar';
import Hero from '../components/Lander/Hero';
import Features from '../components/Lander/Features';
import HowItWorks from '../components/Lander/HowItWorks';
import UseCases from '../components/Lander/UseCases';
import CTA from '../components/Lander/CTA';
import Footer from '../components/Lander/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;