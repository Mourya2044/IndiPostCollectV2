import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../lib/axios';
import {
  Camera, Upload, Send, Sparkles, Plus, ChevronRight,
  Globe, Calendar, Tag, Award, Bot, Info, Loader2,
  Trash2, Paperclip, History, MessageSquare, Edit, X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar";
import { useAuthStore } from '@/store/useAuthStore';

const AIAssistantPage = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userNote, setUserNote] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [aiUsage, setAiUsage] = useState(null);
  const chatFeedRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchAiUsage = async () => {
    try {
      const response = await axiosInstance.get('/ai/usage');
      setAiUsage(response.data);
    } catch (err) { console.error("Error fetching AI usage:", err); }
  };

  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => { fetchSessions(); fetchAiUsage(); }, []);

  useEffect(() => {
    if (sessionId) loadSessionMessages(sessionId);
    else setMessages([]);
  }, [sessionId]);

  const renameSession = async (sessId, newTitle) => {
    if (!newTitle.trim()) return;
    try {
      await axiosInstance.patch(`/ai/sessions/${sessId}/title`, { title: newTitle });
      setEditingSessionId(null);
      fetchSessions();
      toast.success("Chat renamed");
    } catch { toast.error("Failed to rename chat"); }
  };

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await axiosInstance.get('/ai/sessions');
      setSessions(response.data || []);
    } catch { console.error('Error fetching sessions'); } finally { setIsLoadingSessions(false); }
  };

  const loadSessionMessages = async (id) => {
    setIsChatLoading(true);
    try {
      const response = await axiosInstance.get(`/ai/sessions/${id}/messages`);
      const formatted = (response.data || []).map(msg => {
        const sender = msg.type === 'human' ? 'user' : 'ai';
        const content = msg.data?.content || '';
        if (content.startsWith('STAMP_ANALYSIS_DATA:')) {
          try { return { sender, isStampCard: true, stampData: JSON.parse(content.replace('STAMP_ANALYSIS_DATA:', '')) }; }
          catch { return { sender, text: content }; }
        }
        return { sender, text: content };
      });
      setMessages(formatted.length === 0 ? [{ sender: 'ai', text: 'Hello! I am Philabot, your Philately AI Assistant. Upload an image of a stamp to identify it, or ask me any question about stamp collecting!' }] : formatted);
    } catch { toast.error('Failed to load chat history.'); } finally { setIsChatLoading(false); }
  };

  const startNewSession = async () => {
    setIsChatLoading(true);
    try {
      const response = await axiosInstance.post('/ai/new-chat');
      if (response.data?.sessionId) {
        const newId = response.data.sessionId;
        setSessionId(newId);
        localStorage.setItem('ipc_ai_session_id', newId);
        setMessages([{ sender: 'ai', text: 'Hello! I am Philabot, your Philately AI Assistant. Upload an image of a stamp to identify it, or ask me any question about stamp collecting!' }]);
        fetchSessions();
      }
    } catch { toast.error('Failed to initialize AI Chat Session.'); } finally { setIsChatLoading(false); }
  };

  const deleteSession = async (e, idToDelete) => {
    e.stopPropagation();
    if (!window.confirm("Delete this chat session?")) return;
    try {
      await axiosInstance.delete(`/ai/sessions/${idToDelete}`);
      toast.success("Session deleted");
      if (sessionId === idToDelete) { setSessionId(''); localStorage.removeItem('ipc_ai_session_id'); }
      fetchSessions();
    } catch { toast.error('Failed to delete session.'); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const clearAttachment = () => { setSelectedFile(null); setPreviewUrl(null); setUserNote(''); };

  const handleSendChat = async (textToSend) => {
    if (!user.verified) { toast.error('Please verify your email to use AI Assistant.'); return; }
    const text = textToSend || inputText;
    if (!text.trim() && !selectedFile) return;
    if (!sessionId) { toast.error('AI session is not initialized.'); return; }

    setIsChatLoading(true);
    let promptToSend = text;

    if (selectedFile) {
      setIsScanning(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userNote', userNote);
      try {
        const scanResponse = await axiosInstance.post('/ai/recognize', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (scanResponse.data?.data) {
          const stampInfo = scanResponse.data.data;
          const stampLog = `STAMP_ANALYSIS_DATA:${JSON.stringify(stampInfo)}`;
          await axiosInstance.post('/ai/chat', { message: stampLog, sessionId }, { headers: { 'Content-Type': 'application/json' } });
          setMessages(prev => [...prev, { sender: 'user', isStampCard: true, stampData: stampInfo }]);
          promptToSend = `Please analyze the stamp "${stampInfo.title}" issued in ${stampInfo.country} (${stampInfo.year}). Tell me its history, rarity, and design details. Also address my query: ${text}`;
          clearAttachment();
        } else { toast.error('Could not extract stamp details.'); setIsScanning(false); setIsChatLoading(false); return; }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error processing stamp image.');
        setIsScanning(false); setIsChatLoading(false); return;
      } finally { setIsScanning(false); fetchAiUsage(); }
    } else {
      setMessages(prev => [...prev, { sender: 'user', text }]);
    }

    setInputText('');
    setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000/api';
      const response = await fetch(`${serverUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToSend, sessionId }),
        credentials: 'include',
      });
      if (!response.ok) {
        let errMsg = 'Failed to get AI response';
        try { const errData = await response.json(); errMsg = errData.error || errData.message || errMsg; } catch (_) {}
        throw new Error(errMsg);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false, partialData = "";
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          partialData += decoder.decode(value, { stream: !done });
          const lines = partialData.split('\n\n');
          partialData = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.replace('data: ', '').trim());
                if (parsed.text) {
                  setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last?.sender === 'ai') last.text += parsed.text;
                    return updated;
                  });
                }
              } catch {}
            }
          }
        }
      }
      fetchSessions();
    } catch (error) {
      toast.error(error.message || 'Failed to get AI response.');
      setMessages(prev => { const updated = [...prev]; if (updated[updated.length - 1]?.text === '') updated.pop(); return updated; });
    } finally { setIsChatLoading(false); fetchAiUsage(); }
  };

  // ── Text formatter ──
  const parseInline = (line) => {
    let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    const parts = formatted.split(/(<\/?[a-zA-Z0-9]+>)/g);
    let isBold = false, isItalic = false;
    return parts.map((part, i) => {
      if (part === '<strong>') { isBold = true; return null; }
      if (part === '</strong>') { isBold = false; return null; }
      if (part === '<em>') { isItalic = true; return null; }
      if (part === '</em>') { isItalic = false; return null; }
      if (part.startsWith('<') && part.endsWith('>')) return null;
      if (isBold && isItalic) return <strong key={i}><em>{part}</em></strong>;
      if (isBold) return <strong key={i}>{part}</strong>;
      if (isItalic) return <em key={i}>{part}</em>;
      return part;
    }).filter(Boolean);
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => {
      const t = line.trim();
      if (!t) return <div key={i} className="h-2" />;
      if (t.startsWith('# ')) return <h2 key={i} className="text-base font-bold text-IPCprimary mt-4 mb-2">{parseInline(t.substring(2))}</h2>;
      if (t.startsWith('## ')) return <h3 key={i} className="text-sm font-bold text-IPCprimary mt-3 mb-1">{parseInline(t.substring(3))}</h3>;
      if (t.startsWith('### ')) return <h4 key={i} className="text-sm font-semibold text-IPCprimary mt-2 mb-1">{parseInline(t.substring(4))}</h4>;
      if (t.startsWith('- ') || t.startsWith('* ')) return <li key={i} className="ml-4 list-disc my-0.5 text-sm">{parseInline(t.substring(2))}</li>;
      const numMatch = t.match(/^(\d+)\.\s(.*)$/);
      if (numMatch) return <li key={i} className="ml-4 list-decimal my-0.5 text-sm">{parseInline(numMatch[2])}</li>;
      return <p key={i} className="mb-1.5 text-sm leading-relaxed">{parseInline(line)}</p>;
    });
  };

  // ── Stamp scan result card ──
  const StampResultCard = ({ data }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="border border-border overflow-hidden max-w-sm my-1">
        <div className="flex items-center justify-between px-3 py-2 bg-IPCprimary text-white">
          <span className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5" /> Stamp Scan
          </span>
          <span className="text-[9px] px-1.5 py-0.5 border border-white/30 text-white/80 uppercase tracking-widest">AI Verified</span>
        </div>
        <div className="p-3 bg-background space-y-3">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 border border-border bg-muted flex items-center justify-center shrink-0">
              <Camera className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{data.title || 'Unidentified Stamp'}</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <Globe className="h-3 w-3" /> {data.country || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { icon: Calendar, label: 'Year', value: data.year || 'N/A' },
              { icon: Award, label: 'Condition', value: data.condition || 'N/A' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 border border-border px-2.5 py-2">
                <Icon className="h-3.5 w-3.5 text-IPCaccent shrink-0" />
                <div>
                  <span className="text-[9px] text-muted-foreground block uppercase tracking-widest">{label}</span>
                  <span className="text-xs font-semibold text-IPCprimary">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {data.category?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.category.map((cat, idx) => (
                <span key={idx} className="text-[9px] border border-IPCprimary/30 text-IPCprimary px-1.5 py-0.5 uppercase tracking-widest flex items-center gap-0.5">
                  <Tag className="h-2.5 w-2.5" /> {cat}
                </span>
              ))}
            </div>
          )}

          {data.description && (
            <div className="border border-border overflow-hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-IPCprimary/5 text-xs font-semibold text-IPCprimary"
              >
                Historical Context
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-3 py-2.5 text-xs text-muted-foreground leading-relaxed border-t border-border max-h-32 overflow-y-auto">
                  {formatText(data.description)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const quickPrompts = [
    "What makes a stamp rare?",
    "How should I store historical stamps?",
    "Tell me about the British Penny Black stamp.",
    "What is the Inverted Head Four Annas error?"
  ];

  return (
    <SidebarProvider
      className="h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] w-full overflow-hidden"
      style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" }}
    >
      {/* ── Sessions Sidebar ── */}
      <Sidebar collapsible="offcanvas" className="mt-14 h-[calc(100%-3.5rem)] bg-IPCprimary border-r-0">
        <SidebarHeader className="flex flex-row items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <History className="h-4 w-4 text-IPCtext" />
            <span className="text-xs font-semibold uppercase tracking-widest text-IPCtext">Chat History</span>
          </div>
          <button
            onClick={startNewSession}
            className="p-1.5 border border-white/20 text-IPCtext hover:bg-white/10 hover:text-white transition-all"
            title="New chat"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </SidebarHeader>

        <SidebarContent className="p-2 flex flex-col gap-0.5">
          <SidebarMenu>
            {isLoadingSessions ? (
              <div className="flex items-center justify-center py-10 gap-2 text-IPCtext/60 text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-10 text-IPCtext/50 text-xs leading-relaxed px-3">
                No sessions yet.<br />Start a new chat to begin.
              </div>
            ) : sessions.map((sess) => (
              <SidebarMenuItem key={sess.sessionId}>
                <SidebarMenuButton
                  asChild
                  isActive={sessionId === sess.sessionId}
                  className={`w-full group/sess text-IPCtext hover:bg-white/8 hover:text-white data-[active=true]:bg-IPCaccent data-[active=true]:text-white transition-all rounded-none px-3 py-2.5`}
                  onClick={() => { if (editingSessionId !== sess.sessionId) setSessionId(sess.sessionId); }}
                >
                  <div className="w-full flex items-center justify-between">
                    {editingSessionId === sess.sessionId ? (
                      <input
                        type="text"
                        value={editingTitleText}
                        onChange={(e) => setEditingTitleText(e.target.value)}
                        onBlur={() => renameSession(sess.sessionId, editingTitleText)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') renameSession(sess.sessionId, editingTitleText);
                          if (e.key === 'Escape') setEditingSessionId(null);
                        }}
                        autoFocus
                        className="text-xs bg-white/10 text-white px-2 py-1 w-full outline-none border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-xs truncate">{sess.title || 'Untitled Chat'}</span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/sess:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingSessionId(sess.sessionId); setEditingTitleText(sess.title || ''); }}
                            className="p-1 hover:bg-white/15 transition-colors text-inherit"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => deleteSession(e, sess.sessionId)}
                            className="p-1 hover:bg-white/15 transition-colors text-inherit"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* ── Main Chat Panel ── */}
      <SidebarInset className="flex-1 flex flex-col bg-background h-[calc(100vh-3.5rem)] overflow-hidden">

        {/* Top bar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-IPCprimary transition-colors" />
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-IPCprimary flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-IPCprimary">Philabot Studio</span>
            </div>
          </div>
          {aiUsage && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-IPCsecondary" />
              <span>{aiUsage.count}/{aiUsage.limit} queries today</span>
            </div>
          )}
        </div>

        {/* No session: welcome screen */}
        {!sessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-xs space-y-5">
              <div className="w-16 h-16 bg-IPCprimary mx-auto flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-IPCprimary">Philabot Studio</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Your specialized Philately AI assistant. Scan stamps to identify them or ask anything about stamp history and collecting.
                </p>
              </div>
              <button
                onClick={startNewSession}
                disabled={isChatLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Start New Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Message feed */}
            <div ref={chatFeedRef} className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && !msg.isStampCard && (
                    <div className="w-6 h-6 bg-IPCprimary flex items-center justify-center shrink-0 mt-1 mr-2">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  {msg.isStampCard ? (
                    <StampResultCard data={msg.stampData} />
                  ) : (
                    <div className={`max-w-[72%] px-4 py-3 text-sm ${
                      msg.sender === 'user'
                        ? 'bg-IPCprimary text-white'
                        : 'bg-background border border-border text-foreground'
                    }`}>
                      {msg.sender === 'ai' && msg.text === '' ? (
                        <div className="flex items-center gap-1.5 py-0.5">
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="w-2 h-2 bg-IPCsecondary rounded-full animate-bounce"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      ) : msg.sender === 'user' ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <div className="leading-relaxed">{formatText(msg.text)}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 border-t border-border bg-muted/20 shrink-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Suggested topics</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChat(prompt)}
                      className="text-xs border border-border text-foreground px-3 py-1.5 hover:border-IPCprimary hover:text-IPCprimary transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="border-t border-border p-3 shrink-0 bg-background space-y-2">
              {/* Attachment preview */}
              {previewUrl && (
                <div className="flex items-center justify-between px-3 py-2 border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <img src={previewUrl} alt="Attachment preview" className="w-10 h-10 object-contain border border-border bg-background" />
                    <div>
                      <span className="text-xs font-semibold text-IPCprimary block">Stamp attached</span>
                      <input
                        type="text"
                        placeholder="Add context note (optional)…"
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        className="text-[11px] text-muted-foreground bg-transparent border-none outline-none w-48 mt-0.5 placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>
                  <button onClick={clearAttachment} className="p-1 text-muted-foreground hover:text-IPCsecondary transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Input row */}
              <div className="flex items-center gap-2 border border-border focus-within:border-IPCprimary focus-within:ring-1 focus-within:ring-IPCprimary transition-all bg-background px-3 py-2">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-muted-foreground hover:text-IPCprimary transition-colors shrink-0"
                  title="Attach stamp image"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <input
                  type="text"
                  placeholder={isScanning ? "Recognizing your stamp…" : "Ask about stamps or attach an image…"}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isChatLoading && !isScanning && handleSendChat()}
                  disabled={isChatLoading || isScanning}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={isChatLoading || isScanning || (!inputText.trim() && !selectedFile)}
                  className="shrink-0 p-2 bg-IPCprimary text-white hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isScanning || isChatLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Send className="h-4 w-4" />
                  }
                </button>
              </div>
            </div>
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AIAssistantPage;
