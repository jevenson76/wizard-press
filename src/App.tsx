import React, { useState, useEffect } from 'react';
import { Download, ShoppingCart, BookOpen, Feather, Mail, Send, Sparkles, Facebook, X, Instagram, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { createSparkles, createWandTrail } from './sparkleEffects';
import { stripePromise, createCheckoutSession } from './lib/stripe';
import { supabase } from './lib/supabase';
import { ChapterPreview } from './components/ChapterPreview';
import { initializeButtonEffects } from './buttonEffects';

type SubmissionForm = {
  name: string;
  email: string;
  manuscript: string;
  genre: string;
  synopsis: string;
  wordCount: string;
  targetAudience: string;
  marketingPlan: string;
  bio: string;
};

type NewsletterForm = {
  email: string;
  name: string;
};

function App() {
  const [activeTab, setActiveTab] = useState<'books' | 'submit' | 'about' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const { register: registerSubmission, handleSubmit: handleSubmissionSubmit } = useForm<SubmissionForm>();
  const { register: registerNewsletter, handleSubmit: handleNewsletterSubmit, reset } = useForm<NewsletterForm>();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const createNavSparkles = () => {
    const container = document.querySelector('.nav-sparkle-container');
    if (!container) return;

    // Clear existing sparkles
    container.innerHTML = '';

    // Create nav sparkles
    for (let i = 0; i < 35; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'nav-sparkle';
      
      // Randomly assign size class
      const size = Math.random();
      if (size < 0.4) sparkle.classList.add('small');
      else if (size < 0.8) sparkle.classList.add('medium');
      else sparkle.classList.add('large');
      
      // Random position
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      sparkle.style.animationDelay = `${Math.random() * 4}s`;
      
      container.appendChild(sparkle);
    }
  };

  useEffect(() => {
    // Force scroll to top on mount using multiple methods
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Set timeout to ensure scroll happens after render
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    
    // Initialize effects
    createSparkles();
    createNavSparkles();
    initializeButtonEffects();

    // Add scroll to top on route change
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    // Add mouse move handler for wand trail
    const handleMouseMove = (e: MouseEvent) => {
      // Only create trail occasionally to avoid overwhelming the DOM
      if (Math.random() > 0.1) return;
      createWandTrail(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Recreate effects more frequently
    const interval = setInterval(() => {
      createSparkles();
      createNavSparkles();
    }, 8000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const onSubmissionSubmit = (data: SubmissionForm) => {
    console.log('Submission data:', data);
  };

  const onNewsletterSubmit = (data: NewsletterForm) => {
    console.log('Newsletter signup:', data);
    reset();
  };

  const handlePreviewClick = () => {
    setIsPreviewOpen(true);
  };

  // Add scroll to top on tab change with multiple methods
  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    // Force scroll to top with no smooth behavior for immediate effect
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Set timeout to ensure scroll happens after state update
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white" 
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div className="sparkle-container"></div>
      <div className="sparkle-background absolute inset-0"></div>
      
      {/* Navigation Bar with Logo - Full width black from top */}
      <div className="w-full relative z-20 pt-6 pb-4 bg-black">
        <div className="nav-sparkle-container"></div>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap">
          {/* Logo Section */}
          <button 
            onClick={() => handleTabChange(null)}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity bloom"
          >
            <img
              src="/assets/images/logo.png"
              alt="Wizard Press Logo"
              className="w-[144px] h-[144px] object-contain"
            />
            <div>
              <h1 className="font-cinzel text-4xl font-bold text-blue-400 tracking-wider magical-text-strong">Wizard Press</h1>
              <p className="font-cormorant text-2xl text-blue-200 italic magical-text">Bringing Magic to the Written Word</p>
            </div>
          </button>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {[
              { id: 'books', label: 'Books' },
              { id: 'submit', label: 'Submit Book' },
              { id: 'about', label: 'About' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as typeof activeTab)}
                className={`px-6 py-2 rounded-full font-cinzel text-base text-blue-200 
                  magical-button bloom ${activeTab === tab.id ? 'active-nav-button' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Fade Effect */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Landing Content when no tab is selected */}
        {!activeTab && (
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-2xl p-16 shadow-2xl border border-blue-500/20 text-center mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-cormorant text-blue-100 mb-8">
                Welcome to Wizard Press
              </h1>
              <p className="text-xl md:text-2xl text-blue-100/90 font-cormorant mb-8">
                Wizard Press is a boutique publishing house driven by a passion for amplifying bold ideas and unforgettable stories—across all genres, voices, and walks of life.
              </p>
              <p className="text-lg md:text-xl text-blue-100/80 font-cormorant mb-16">
                Whether you're an emerging author with a fresh perspective or a seasoned writer with a powerful message, we're here to help bring your vision to life. We believe in genuine collaboration, creative freedom, and providing hands-on support throughout every stage of your publishing journey.
              </p>
              <div className="grid md:grid-cols-3 gap-12 mt-16">
                <div className="p-8 bg-blue-900/50 rounded-xl h-full border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                  <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="font-cinzel text-3xl text-blue-300 mb-4 magical-text">Selective<br/>Curation</h3>
                  <p className="text-blue-100/80 text-lg font-cormorant">
                    We carefully choose works that offer valuable insights and authentic perspectives
                  </p>
                </div>
                <div className="p-8 bg-blue-900/50 rounded-xl h-full border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                  <Feather className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="font-cinzel text-3xl text-blue-300 mb-4 magical-text">Author<br/>Support</h3>
                  <p className="text-blue-100/80 text-lg font-cormorant">
                    Personalized guidance and collaborative partnership throughout your publishing journey
                  </p>
                </div>
                <div className="p-8 bg-blue-900/50 rounded-xl h-full border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                  <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="font-cinzel text-3xl text-blue-300 mb-4 magical-text">Reader<br/>Connection</h3>
                  <p className="text-blue-100/80 text-lg font-cormorant">
                    Creating meaningful experiences that resonate with and inspire readers
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Books Section */}
        {activeTab === 'books' && (
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-500/20">
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-4xl text-blue-300 mb-4 magical-text-strong">Transformative Stories</h2>
              <p className="font-cormorant text-xl text-blue-100 max-w-2xl mx-auto">
                Discover books that challenge perspectives, inspire growth, and illuminate paths to personal transformation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="max-w-sm mx-auto perspective relative">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 
                    text-blue-200 hover:text-white transition-colors duration-300"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 
                    text-blue-200 hover:text-white transition-colors duration-300"
                  aria-label="Next"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                <div className={`relative transition-transform duration-1000 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl backface-hidden">
                    <div className="absolute inset-0 border-2 border-blue-400/50 rounded-lg glow"></div>
                    <img
                      src="/assets/images/books/done-with-the-bullshit-front.png"
                      alt="Done With the Bullshit Front Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute inset-0 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl backface-hidden rotate-y-180 bg-gradient-to-br from-blue-900 to-black">
                    <div className="absolute inset-0 border-2 border-blue-400/50 rounded-lg glow"></div>
                    <img
                      src="/assets/images/books/done-with-the-bullshit-back.png"
                      alt="Done With the Bullshit Back Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="text-white">
                <h2 className="font-cinzel text-3xl font-bold mb-2 text-blue-300 magical-text-strong">
                  Done With the Bullshit
                </h2>
                <h3 className="font-cormorant text-xl text-blue-200 mb-6">
                  Dating From Worth
                </h3>
                <div className="space-y-4 text-lg font-cormorant">
                  <p className="flex items-center gap-2">
                    <span className="text-blue-400">Author:</span>
                    <span className="text-blue-100">Sara Richard</span>
                  </p>
                  <p className="text-blue-100 text-xl leading-relaxed mb-6">
                    A revolutionary guide that transforms the way we approach relationships. 
                    Sara Richard delivers a powerful message about self-worth, authentic connections, 
                    and breaking free from toxic dating patterns.
                  </p>
                  <p className="text-blue-100 text-xl italic">
                    Coming Summer 2025 – Clear your bookshelf... and your dating roster.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button 
                    onClick={handlePreviewClick}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full font-cinzel 
                      hover:bg-blue-400 transition-colors duration-300 nav-button-glow
                      flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Preview Chapter
                  </button>
                  <button className="bg-blue-900/50 text-blue-200 px-6 py-3 rounded-full font-cinzel
                    hover:bg-blue-800/50 transition-colors duration-300 nav-button-glow
                    flex items-center justify-center gap-2 border border-blue-400/30">
                    <ShoppingCart className="w-5 h-5" />
                    Pre-Order Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Section */}
        {activeTab === 'submit' && (
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-500/20">
            <div className="text-center mb-8">
              <Feather className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="font-cinzel text-3xl text-blue-300 mb-4 magical-text-strong">Submit Your Manuscript</h2>
              <p className="font-cormorant text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Whether you're a first-time author or an established voice, we welcome manuscripts 
                that align with our mission to publish meaningful, transformative works. We're 
                particularly interested in:
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                <div className="p-4 bg-blue-900/50 rounded-lg flex flex-col h-full">
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-3 text-center">Fresh Perspectives</h3>
                  <p className="text-blue-100/80 font-cormorant text-lg">Innovative approaches to personal growth and development</p>
                </div>
                <div className="p-4 bg-blue-900/50 rounded-lg flex flex-col h-full">
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-3 text-center">Practical Wisdom</h3>
                  <p className="text-blue-100/80 font-cormorant text-lg">Actionable insights that guide readers toward positive change</p>
                </div>
                <div className="p-4 bg-blue-900/50 rounded-lg flex flex-col h-full">
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-3 text-center">Authentic Voices</h3>
                  <p className="text-blue-100/80 font-cormorant text-lg">Genuine stories that connect and resonate with readers</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmissionSubmit(onSubmissionSubmit)} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-blue-200 font-cinzel">Name</label>
                  <input
                    type="text"
                    {...registerSubmission('name', { required: true })}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                      text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-blue-200 font-cinzel">Email</label>
                  <input
                    type="email"
                    {...registerSubmission('email', { required: true })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                      text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-blue-200 font-cinzel">Manuscript Title</label>
                <input
                  type="text"
                  {...registerSubmission('manuscript', { required: true })}
                  placeholder="Your book's title"
                  className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                    text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-blue-200 font-cinzel">Genre</label>
                  <select
                    {...registerSubmission('genre', { required: true })}
                    className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                      text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Select a genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="self-help">Self-Help</option>
                    <option value="spirituality">Spirituality</option>
                    <option value="relationships">Relationships</option>
                    <option value="personal-growth">Personal Growth</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-blue-200 font-cinzel">Word Count</label>
                  <input
                    type="text"
                    {...registerSubmission('wordCount', { required: true })}
                    placeholder="Approximate word count"
                    className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                      text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-blue-200 font-cinzel">Synopsis</label>
                <textarea
                  {...registerSubmission('synopsis', { required: true })}
                  rows={4}
                  placeholder="Brief overview of your book (max 500 words)"
                  className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                    text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-blue-200 font-cinzel">Target Audience</label>
                <textarea
                  {...registerSubmission('targetAudience', { required: true })}
                  rows={2}
                  placeholder="Who is your book's intended audience?"
                  className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                    text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-blue-200 font-cinzel">Author Bio</label>
                <textarea
                  {...registerSubmission('bio', { required: true })}
                  rows={3}
                  placeholder="Tell us about yourself and your writing experience"
                  className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                    text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-blue-200 font-cinzel">Marketing Vision</label>
                <textarea
                  {...registerSubmission('marketingPlan', { required: true })}
                  rows={3}
                  placeholder="How do you envision marketing your book? Include any relevant platform presence or audience reach."
                  className="w-full px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-400/30 
                    text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-full font-cinzel 
                  hover:bg-blue-400 transition-colors duration-300 nav-button-glow"
              >
                Submit Manuscript
              </button>
            </form>
          </div>
        )}

        {/* About Section */}
        {activeTab === 'about' && (
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-500/20">
            <div className="text-center mb-12">
              <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="font-cinzel text-4xl text-blue-300 mb-6 magical-text-strong">About Wizard Press</h2>
              <div className="font-cormorant text-xl text-blue-100 max-w-3xl mx-auto space-y-6">
                <p>
                  Established in 2024, Wizard Press is a boutique publishing house dedicated to 
                  bringing meaningful and transformative works to readers. As a new voice in 
                  publishing, we combine fresh perspectives with professional expertise to support 
                  both emerging and established authors.
                </p>
                <p>
                  Our focus is on quality over quantity, carefully selecting works that offer 
                  valuable insights and practical wisdom. We believe in building strong 
                  relationships with our authors and providing personalized attention to each 
                  project we undertake.
                </p>
                <p>
                  What sets us apart is our commitment to creating a supportive community around 
                  our books and authors. Through carefully curated events, workshops, and digital 
                  platforms, we help connect authors with their readers and foster meaningful 
                  discussions.
                </p>
                <div className="mt-12 p-6 bg-blue-900/50 rounded-xl">
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-4 magical-text">Contact Us</h3>
                  <div className="space-y-2">
                    <p className="text-blue-100">
                      <strong className="text-blue-300">Email:</strong>{" "}
                      <a href="mailto:inquiry@wizard-press.com" className="text-blue-400 hover:text-blue-300">
                        inquiry@wizard-press.com
                      </a>
                    </p>
                    <p className="text-blue-100">
                      <strong className="text-blue-300">Address:</strong><br />
                      332 S Michigan Ave<br />
                      Suite 121 #5806<br />
                      Chicago, IL 60604<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="max-w-xl mx-auto mt-12 p-8 bg-blue-900/50 rounded-xl">
              <h3 className="font-cinzel text-2xl text-blue-300 mb-4 text-center magical-text">Join Our Magical Community</h3>
              <p className="text-blue-100 text-center mb-6 font-cormorant text-lg">
                Subscribe to receive exclusive updates, author interviews, and magical reading recommendations.
              </p>
              <form onSubmit={handleNewsletterSubmit(onNewsletterSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    {...registerNewsletter('name')}
                    placeholder="Your name"
                    className="px-4 py-2 rounded-full bg-blue-900/30 border border-blue-400/30 
                      text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="email"
                    {...registerNewsletter('email', { required: true })}
                    placeholder="Your email"
                    className="px-4 py-2 rounded-full bg-blue-900/30 border border-blue-400/30 
                      text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-full font-cinzel 
                    hover:bg-blue-400 transition-colors duration-300 nav-button-glow
                    flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Subscribe to Updates
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-blue-500/20 pt-12">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="font-cinzel text-xl text-blue-300 mb-2">About Us</h4>
              <p className="text-blue-100 font-cormorant">
                Wizard Press is a boutique publishing house bringing magic to the written word since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-cinzel text-xl text-blue-300 mb-2">Quick Links</h4>
              <ul className="space-y-1 font-cormorant">
                <li><button onClick={() => handleTabChange(null)} className="text-blue-100 hover:text-blue-300">Home</button></li>
                <li><button onClick={() => handleTabChange('books')} className="text-blue-100 hover:text-blue-300">Books</button></li>
                <li><button onClick={() => handleTabChange('submit')} className="text-blue-100 hover:text-blue-300">Submit Manuscript</button></li>
                <li><button onClick={() => handleTabChange('about')} className="text-blue-100 hover:text-blue-300">About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-cinzel text-xl text-blue-300 mb-2">Contact</h4>
              <ul className="space-y-1 font-cormorant">
                <li className="text-blue-100">332 S Michigan Ave</li>
                <li className="text-blue-100">Suite 121 #5806</li>
                <li className="text-blue-100">Chicago, IL 60604</li>
                <li>
                  <a href="mailto:inquiry@wizard-press.com" className="text-blue-100 hover:text-blue-300">
                    inquiry@wizard-press.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-cinzel text-xl text-blue-300 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-blue-300">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-blue-300">
                  <X className="w-6 h-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-blue-300">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-blue-300">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center border-t border-blue-500/20 pt-6 pb-4">
            <p className="text-blue-100 font-cormorant">
              © 2025 Wizard Press. All rights reserved.
            </p>
          </div>
        </footer>

        <ChapterPreview 
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;