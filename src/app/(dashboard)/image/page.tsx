'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, UploadCloud, FileText, Sparkles, X, ScanText, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageSummarizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ocr: string; explanation: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
    } else if (selected) {
      toast.error('Please select a valid image file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped);
      setPreviewUrl(URL.createObjectURL(dropped));
      setResult(null);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    
    // Simulate Vision API Call (OCR + Explanation)
    // In production, you would convert the file to base64 and send it to your /api/summarize-image route
    setTimeout(() => {
      setResult({
        ocr: "System Architecture Diagram: Client -> API Gateway -> Auth Service -> Database. Features caching via Redis and async queues via Kafka.",
        explanation: "This image shows a backend system architecture. The client connects to an API Gateway, which routes traffic to an Authentication Service and subsequently to a unified Database. It utilizes caching (Redis) for faster reads and a message queue (Kafka) for background jobs like video processing."
      });
      setLoading(false);
      toast.success('Image analyzed successfully!');
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 mb-6 shadow-premium">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Vision <span className="gradient-text bg-gradient-to-r from-emerald-400 to-teal-500">Summarizer</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Upload notes, diagrams, or slides. Our Vision AI extracts the text and explains complex concepts simply.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="glass-panel p-8 sm:p-10 rounded-[3rem] border-white/10 shadow-[0_0_50px_rgba(67,233,123,0.15)] bg-black/40 backdrop-blur-2xl"
          >
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
              <UploadCloud className="w-6 h-6 text-[#38f9d7] animate-pulse" />
              Upload Source Matrix
            </h3>

            {!previewUrl ? (
              <div 
                className="relative border-2 border-dashed border-white/20 hover:border-[#38f9d7] hover:bg-[#38f9d7]/5 transition-all duration-500 rounded-[2rem] p-12 text-center cursor-pointer flex flex-col items-center justify-center min-h-[350px] group overflow-hidden"
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#38f9d7]/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
                  <ImageIcon className="w-10 h-10 text-white/50 group-hover:text-[#38f9d7]" />
                </div>
                <h4 className="font-black text-xl mb-2 text-white relative z-10">INITIALIZE TRANSFER</h4>
                <p className="text-sm font-medium text-white/50 mb-8 relative z-10 uppercase tracking-widest">Drag image or click to browse</p>
                <button className="px-8 py-3 rounded-full bg-white text-black font-black uppercase tracking-wider text-xs hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] relative z-10">
                  Select Data Target
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-border group">
                <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover max-h-[500px]" />
                <button 
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-rose-500 text-foreground hover:text-white backdrop-blur-md rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {loading ? 'Analyzing with Vision API...' : 'Analyze Image'}
            </button>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full gap-6"
          >
            <AnimatePresence mode="popLayout">
              {!result && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass flex flex-col items-center justify-center p-12 text-center rounded-3xl h-full min-h-[400px]"
                >
                  <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold text-muted-foreground mb-2">Waiting for input</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Upload an image and hit analyze to extract text and get instant explanations.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass p-8 rounded-3xl h-full flex flex-col gap-6"
                >
                  <div className="w-32 h-6 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="space-y-3 mb-8">
                    <div className="w-full h-4 bg-muted animate-pulse rounded-md" />
                    <div className="w-full h-4 bg-muted animate-pulse rounded-md" />
                    <div className="w-3/4 h-4 bg-muted animate-pulse rounded-md" />
                  </div>
                  
                  <div className="w-40 h-6 bg-muted animate-pulse rounded-md mb-2 mt-4" />
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-emerald-500/10 animate-pulse rounded-md" />
                    <div className="w-full h-4 bg-emerald-500/10 animate-pulse rounded-md" />
                    <div className="w-5/6 h-4 bg-emerald-500/10 animate-pulse rounded-md" />
                  </div>
                </motion.div>
              )}

              {result && !loading && (
                <div className="flex flex-col gap-6 w-full h-full">
                  {/* OCR Text */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass p-6 sm:p-8 rounded-3xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10" />
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <ScanText className="w-5 h-5 text-indigo-500" />
                      Extracted Text
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm bg-muted/30 p-4 rounded-xl font-mono">
                      {result.ocr}
                    </p>
                  </motion.div>

                  {/* Explanation */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                    className="glass p-6 sm:p-8 rounded-3xl relative overflow-hidden border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] h-full"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10" />
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-emerald-500" />
                      AI Explanation
                    </h4>
                    <p className="text-foreground leading-relaxed">
                      {result.explanation}
                    </p>
                    
                    <button className="mt-8 flex items-center gap-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors">
                      <FileText className="w-4 h-4" />
                      Save to Smart Notes
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
