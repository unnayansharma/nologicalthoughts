import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Clock, Heart, MessageCircle } from 'lucide-react';

interface Thought {
  id: string;
  content: string;
  timestamp: Date;
  likes: number;
}

const mockThoughts: Thought[] = [
  { id: '1', content: "sometimes I wonder if clouds get lonely floating up there by themselves", timestamp: new Date(Date.now() - 1000 * 60 * 5), likes: 12 },
  { id: '2', content: "why do we say 'sleep like a baby' when babies wake up crying every two hours", timestamp: new Date(Date.now() - 1000 * 60 * 23), likes: 47 },
  { id: '3', content: "the moon is just the sun's night shift worker", timestamp: new Date(Date.now() - 1000 * 60 * 45), likes: 89 },
];

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Home() {
  const [thought, setThought] = useState('');
  const [thoughts, setThoughts] = useState<Thought[]>(mockThoughts);
  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'feed'>('write');
  const [likedThoughts, setLikedThoughts] = useState<Set<string>>(new Set());

  const handlePost = () => {
    if (!thought.trim()) return;
    setIsPosting(true);
    
    setTimeout(() => {
      const newThought: Thought = {
        id: Date.now().toString(),
        content: thought.trim(),
        timestamp: new Date(),
        likes: 0,
      };
      setThoughts([newThought, ...thoughts]);
      setThought('');
      setIsPosting(false);
      setActiveTab('feed');
    }, 600);
  };

  const handleLike = (id: string) => {
    const isLiked = likedThoughts.has(id);
    setLikedThoughts(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    setThoughts(thoughts.map(t => 
      t.id === id ? { ...t, likes: isLiked ? t.likes - 1 : t.likes + 1 } : t
    ));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 noise-texture" />
      </div>

      {/* iOS Status Bar Space */}
      <div className="ios-safe-top" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-4 pb-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-2xl text-gradient" data-testid="text-app-title">
              nologicalthoughts
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              unfiltered. anonymous. free.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
      </header>

      {/* Tab Switcher */}
      <div className="relative z-10 px-6 mb-6">
        <div className="glass rounded-2xl p-1 flex">
          <motion.button
            data-testid="button-tab-write"
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'write' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            Write
          </motion.button>
          <motion.button
            data-testid="button-tab-feed"
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'feed' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            Feed
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 px-6 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'write' ? (
            <motion.div
              key="write"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Write Area */}
              <div className="glass-strong rounded-3xl p-6 glow-primary">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Anonymous</p>
                    <p className="text-xs text-muted-foreground/50">Your identity is hidden</p>
                  </div>
                </div>

                <textarea
                  data-testid="input-thought"
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="let it out... no logic needed"
                  className="w-full bg-transparent text-foreground text-lg placeholder:text-muted-foreground/40 focus:outline-none min-h-[180px] leading-relaxed font-display"
                  maxLength={280}
                />

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <span className={`text-sm ${thought.length > 250 ? 'text-destructive' : 'text-muted-foreground/50'}`}>
                    {thought.length}/280
                  </span>
                  <motion.button
                    data-testid="button-post"
                    onClick={handlePost}
                    disabled={!thought.trim() || isPosting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isPosting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isPosting ? 'Releasing...' : 'Release'}
                  </motion.button>
                </div>
              </div>

              {/* Prompts */}
              <div className="mt-8">
                <p className="text-muted-foreground text-sm mb-4">Need a spark?</p>
                <div className="flex flex-wrap gap-2">
                  {['what if...', 'I never told anyone but...', 'at 3am I think about...', 'unpopular opinion:'].map((prompt) => (
                    <motion.button
                      key={prompt}
                      data-testid={`button-prompt-${prompt.replace(/[^a-z]/g, '')}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setThought(prompt + ' ')}
                      className="glass px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {thoughts.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-3xl p-5"
                  data-testid={`card-thought-${t.id}`}
                >
                  <p className="font-display text-lg leading-relaxed text-foreground/90 mb-4">
                    {t.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimeAgo(t.timestamp)}</span>
                    </div>
                    <motion.button
                      data-testid={`button-like-${t.id}`}
                      onClick={() => handleLike(t.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center gap-1.5 transition-colors ${
                        likedThoughts.has(t.id) 
                          ? 'text-red-500' 
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedThoughts.has(t.id) ? 'fill-red-500' : ''}`} />
                      <span className="text-sm">{t.likes}</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}

              <div className="text-center py-8">
                <p className="text-muted-foreground/40 text-sm">
                  thoughts drift away into the void...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* iOS Home Indicator */}
      <div className="fixed bottom-0 left-0 right-0 z-50 ios-safe-bottom">
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
