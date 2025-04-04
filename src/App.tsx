import React, { useState, useEffect } from 'react';
import { Download, ShoppingCart, BookOpen, Feather, Mail, Send, Sparkles, Facebook, X, Instagram, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { createSparkles } from './sparkleEffects';
import { stripePromise, createCheckoutSession } from './lib/stripe';

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

  useEffect(() => {
    createSparkles();
  }, []);

  const onSubmissionSubmit = (data: SubmissionForm) => {
    console.log('Submission data:', data);
  };

  const onNewsletterSubmit = (data: NewsletterForm) => {
    console.log('Newsletter signup:', data);
    reset();
  };

  const handleDownloadSample = async () => {
    try {
      setIsDownloading(true);
      // URL to the sample chapter PDF
      const sampleChapterUrl = '/assets/files/sample-chapter.pdf';
      
      // Check if file exists
      const response = await fetch(sampleChapterUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('Sample chapter not available');
      }
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = sampleChapterUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer'; // Security best practice
      link.download = 'Done-With-The-Bullshit-Sample-Chapter.pdf';
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading sample chapter:', error);
      alert('Sorry, there was an error downloading the sample chapter. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="sparkle-background absolute inset-0"></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header with Navigation */}
        <header className="flex justify-between items-center mb-16">
          <button 
            onClick={() => setActiveTab(null)} 
            className="flex items-center gap-6 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/images/logo.png"
              alt="Wizard Press Logo"
              className="w-36 h-36 object-contain"
            />
            <div>
              <h1 className="font-cinzel text-4xl font-bold text-blue-400 tracking-wider">
                Wizard Press
              </h1>
              <p className="font-cormorant text-xl text-blue-200 italic">
                Bringing Magic to the Written Word
              </p>
            </div>
          </button>

          <div className="bg-black/50 backdrop-blur-lg rounded-full p-2">
            <nav>
              <div className="flex gap-6">
                {[
                  { id: 'books', label: 'Books' },
                  { id: 'submit', label: 'Submit Book' },
                  { id: 'about', label: 'About' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-8 py-3 rounded-full font-cinzel text-lg transition-all duration-300 nav-button-glow ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        {/* Landing Content when no tab is selected */}
        {!activeTab && (
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-2xl p-16 shadow-2xl border border-blue-500/20 text-center mb-16">
            <h2 className="font-cinzel text-5xl text-blue-300 mb-8">Welcome to Wizard Press</h2>
            <div className="font-cormorant text-2xl text-blue-100 max-w-4xl mx-auto space-y-10">
              <p className="leading-relaxed">
                As a boutique publishing house established in 2024, we're dedicated to discovering and nurturing 
                exceptional voices in personal development, spirituality, and transformative literature.
              </p>
              <p className="leading-relaxed">
                Our commitment is to both emerging and established authors who bring fresh perspectives 
                and meaningful insights to their readers. We believe in building lasting partnerships 
                and providing personalized guidance throughout the publishing journey.
              </p>
              <div className="grid md:grid-cols-3 gap-12 mt-16">
                <div className="p-8 bg-blue-900/50 rounded-xl h-full">
                  <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-4">Selective Curation</h3>
                  <p className="text-blue-100 text-xl">
                    We carefully choose works that offer valuable insights and authentic perspectives
                  </p>
                </div>
                <div className="p-8 bg-blue-900/50 rounded-xl h-full">
                  <Feather className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-4">Author Support</h3>
                  <p className="text-blue-100 text-xl">
                    Personalized guidance and collaborative partnership throughout your publishing journey
                  </p>
                </div>
                <div className="p-8 bg-blue-900/50 rounded-xl h-full">
                  <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-4">Reader Connection</h3>
                  <p className="text-blue-100 text-xl">
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
              <h2 className="font-cinzel text-4xl text-blue-300 mb-4">Transformative Stories</h2>
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
                <h2 className="font-cinzel text-3xl font-bold mb-2 text-blue-300">
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
                    onClick={handleDownloadSample}
                    disabled={isDownloading}
                    className={`bg-blue-500 text-white px-6 py-3 rounded-full font-cinzel 
                      hover:bg-blue-400 transition-colors duration-300 nav-button-glow
                      flex items-center justify-center gap-2 ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                    {isDownloading ? 'Downloading...' : 'Download Sample'}
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
              <h2 className="font-cinzel text-3xl text-blue-300 mb-4">Submit Your Manuscript</h2>
              <p className="font-cormorant text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Whether you're a first-time author or an established voice, we welcome manuscripts 
                that align with our mission to publish meaningful, transformative works. We're 
                particularly interested in:
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                <div className="p-4 bg-blue-900/50 rounded-lg flex flex-col justify-between h-full">
                  <h3 className="font-cinzel text-lg text-blue-300 mb-2">Fresh Perspectives</h3>
                  <p className="text-blue-100">Innovative approaches to personal growth and development</p>
                </div>
                <div className="p-4 bg-blue-900/50 rounded-lg flex flex-col justify-between h-full">
                  <h3 className="font-cinzel text-lg text-blue-300 mb-2">Practical Wisdom</h3>
                  <p className="text-blue-100">Actionable insights that guide readers toward positive change</p>
                </div>
                <div className="p-4 bg-blue-900/50 rounded-lg flex flex-col justify-between h-full">
                  <h3 className="font-cinzel text-lg text-blue-300 mb-2">Authentic Voices</h3>
                  <p className="text-blue-100">Genuine stories that connect and resonate with readers</p>
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
              <h2 className="font-cinzel text-4xl text-blue-300 mb-6">About Wizard Press</h2>
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
                  <h3 className="font-cinzel text-2xl text-blue-300 mb-4">Contact Us</h3>
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
              <h3 className="font-cinzel text-2xl text-blue-300 mb-4 text-center">Join Our Magical Community</h3>
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
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-cinzel text-xl text-blue-300 mb-4">About Us</h4>
              <p className="text-blue-100 font-cormorant">
                Wizard Press is a boutique publishing house bringing magic to the written word since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-cinzel text-xl text-blue-300 mb-4">Quick Links</h4>
              <ul className="space-y-2 font-cormorant">
                <li><button onClick={() => setActiveTab(null)} className="text-blue-100 hover:text-blue-300">Home</button></li>
                <li><button onClick={() => setActiveTab('books')} className="text-blue-100 hover:text-blue-300">Books</button></li>
                <li><button onClick={() => setActiveTab('submit')} className="text-blue-100 hover:text-blue-300">Submit Manuscript</button></li>
                <li><button onClick={() => setActiveTab('about')} className="text-blue-100 hover:text-blue-300">About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-cinzel text-xl text-blue-300 mb-4">Contact</h4>
              <ul className="space-y-2 font-cormorant">
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
              © 2024 Wizard Press. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;