import React, { useState } from 'react';
import { PenTool, MessageSquarePlus, Sparkles, RefreshCw } from 'lucide-react';
import AudioRecorder from './components/AudioRecorder';
import IdeaCard from './components/IdeaCard';
import { generateContentIdeas } from './services/geminiService';
import { blobToBase64 } from './utils/audioHelper';
import { ContentIdea, InputMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<InputMode>(InputMode.VOICE);
  const [textInput, setTextInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAudioRecorded = async (audioBlob: Blob) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedIdeas([]);

    try {
      const base64Audio = await blobToBase64(audioBlob);
      // Pass empty string for text prompt if we are using audio-only, 
      // or we could add a specific instruction like "Transcribe and generate"
      const ideas = await generateContentIdeas("", base64Audio, audioBlob.type);
      setGeneratedIdeas(ideas);
    } catch (err) {
      console.error(err);
      setError("Failed to generate ideas. Please try speaking clearly again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedIdeas([]);

    try {
      const ideas = await generateContentIdeas(textInput);
      setGeneratedIdeas(ideas);
    } catch (err) {
      console.error(err);
      setError("Failed to generate ideas. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">
              Burmese GenAI
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-full">
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Create Content with your Voice
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Speak in Burmese to generate professional social media captions, blog ideas, and more instantly.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 mb-10">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setMode(InputMode.VOICE)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === InputMode.VOICE 
                  ? 'bg-white text-teal-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Voice Input</span>
            </button>
            <button
              onClick={() => setMode(InputMode.TEXT)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === InputMode.TEXT 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Text Input</span>
            </button>
          </div>

          <div className="px-4 pb-6">
            {mode === InputMode.VOICE ? (
              <AudioRecorder onAudioRecorded={handleAudioRecorded} isProcessing={isGenerating} />
            ) : (
              <form onSubmit={handleTextSubmit} className="flex flex-col">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your idea in Burmese here..."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none mb-4 transition-all"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !textInput.trim()}
                  className="self-end bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Ideas</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 text-center text-sm">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {generatedIdeas.length > 0 && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Generated Ideas</h3>
              <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                {generatedIdeas.length} results
              </span>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {generatedIdeas.map((idea, index) => (
                <div key={index} className="flex flex-col h-full">
                   <IdeaCard idea={idea} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}

        {generatedIdeas.length === 0 && !isGenerating && !error && (
            <div className="text-center py-12 opacity-50">
                <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                     <Sparkles className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">Ready to transform your ideas</p>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;