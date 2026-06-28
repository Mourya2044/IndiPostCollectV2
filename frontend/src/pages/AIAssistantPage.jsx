import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../lib/axios';
import { 
  Camera, 
  Upload, 
  Send, 
  Sparkles, 
  Plus, 
  ChevronRight, 
  Globe, 
  Calendar, 
  Tag, 
  Award, 
  Bot, 
  Info,
  Loader2,
  Trash2,
  Menu,
  X,
  Paperclip,
  History,
  MessageSquare,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const AIAssistantPage = () => {
  // Sidebar and Session states
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // Chat Feed states
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // File Upload states (inline scanner)
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userNote, setUserNote] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const chatFeedRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages]);

  const renameSession = async (sessId, newTitle) => {
    if (!newTitle.trim()) return;
    try {
      await axiosInstance.patch(`/ai/sessions/${sessId}/title`, { title: newTitle });
      setEditingSessionId(null);
      fetchSessions();
      toast.success("Chat renamed");
    } catch (error) {
      console.error("Rename failed:", error);
      toast.error("Failed to rename chat");
    }
  };

  // Load chat sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch session on selection
  useEffect(() => {
    if (sessionId) {
      loadSessionMessages(sessionId);
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await axiosInstance.get('/ai/sessions');
      setSessions(response.data || []);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadSessionMessages = async (id) => {
    setIsChatLoading(true);
    try {
      const response = await axiosInstance.get(`/ai/sessions/${id}/messages`);
      const formatted = (response.data || []).map(msg => {
        const sender = msg.type === 'human' ? 'user' : 'ai';
        const content = msg.data?.content || '';
        
        // Check if content looks like a stamp analysis result (JSON)
        if (content.startsWith('STAMP_ANALYSIS_DATA:')) {
          try {
            const stampJson = content.replace('STAMP_ANALYSIS_DATA:', '');
            const stampData = JSON.parse(stampJson);
            return {
              sender,
              isStampCard: true,
              stampData
            };
          } catch (e) {
            return { sender, text: content };
          }
        }

        return { sender, text: content };
      });

      if (formatted.length === 0) {
        setMessages([
          {
            sender: 'ai',
            text: 'Hello! I am Philabot, your Philately AI Assistant. Upload an image of a stamp to identify it, or ask me any question about stamp collecting!'
          }
        ]);
      } else {
        setMessages(formatted);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
      toast.error('Failed to load chat history.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const startNewSession = async () => {
    setIsChatLoading(true);
    try {
      const response = await axiosInstance.post('/ai/new-chat');
      if (response.data && response.data.sessionId) {
        const newId = response.data.sessionId;
        setSessionId(newId);
        localStorage.setItem('ipc_ai_session_id', newId);
        setMessages([
          {
            sender: 'ai',
            text: 'Hello! I am Philabot, your Philately AI Assistant. Upload an image of a stamp to identify it, or ask me any question about stamp collecting!'
          }
        ]);
        fetchSessions();
      }
    } catch (error) {
      console.error('Error starting new AI session:', error);
      toast.error('Failed to initialize AI Chat Session.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const deleteSession = async (e, idToDelete) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat session?")) return;

    try {
      await axiosInstance.delete(`/ai/sessions/${idToDelete}`);
      toast.success("Session deleted");
      if (sessionId === idToDelete) {
        setSessionId('');
        localStorage.removeItem('ipc_ai_session_id');
      }
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUserNote('');
  };

  const handleSendChat = async (textToSend) => {
    const text = textToSend || inputText;
    
    // Guard: Require either text or file
    if (!text.trim() && !selectedFile) return;

    if (!sessionId) {
      toast.error('AI session is not initialized.');
      return;
    }

    setIsChatLoading(true);
    let promptToSend = text;

    // Handle file upload and recognition first
    if (selectedFile) {
      setIsScanning(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userNote', userNote);

      try {
        const scanResponse = await axiosInstance.post('/ai/recognize', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (scanResponse.data && scanResponse.data.data) {
          const stampInfo = scanResponse.data.data;
          
          // Save the scan result to database history implicitly by writing a structured log message
          const stampLog = `STAMP_ANALYSIS_DATA:${JSON.stringify(stampInfo)}`;
          await axiosInstance.post('/ai/chat', { message: stampLog, sessionId }, { headers: { 'Content-Type': 'application/json' } });

          // Add locally to messages array to render beautifully inline
          setMessages(prev => [...prev, {
            sender: 'user',
            isStampCard: true,
            stampData: stampInfo
          }]);

          promptToSend = `Please analyze the stamp "${stampInfo.title}" issued in ${stampInfo.country} (${stampInfo.year}). Tell me its history, rarity, and the design detail. Also address my query if any: ${text}`;
          clearAttachment();
        } else {
          toast.error('Could not extract stamp details.');
          setIsScanning(false);
          setIsChatLoading(false);
          return;
        }
      } catch (error) {
        console.error('Stamp scanner failed:', error);
        const errMsg = error.response?.data?.error || 'Error processing the stamp image.';
        toast.error(errMsg);
        setIsScanning(false);
        setIsChatLoading(false);
        return;
      } finally {
        setIsScanning(false);
      }
    } else {
      // Standard text message
      setMessages(prev => [...prev, { sender: 'user', text: text }]);
    }

    setInputText('');
    setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
      const response = await fetch(`${serverUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToSend, sessionId: sessionId }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to get streaming response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let partialData = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkText = decoder.decode(value, { stream: !done });
          partialData += chunkText;

          const lines = partialData.split('\n\n');
          partialData = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace('data: ', '').trim();
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.text) {
                  setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.sender === 'ai') {
                      last.text += parsed.text;
                    }
                    return updated;
                  });
                }
              } catch (e) {
                console.error("SSE parsing error:", e);
              }
            }
          }
        }
      }
      
      // Refresh session list to update titles or last updated times
      fetchSessions();
    } catch (error) {
      console.error('Chat session error:', error);
      toast.error('Failed to get AI response.');
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.text === '') {
          updated.pop();
        }
        return updated;
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const parseLineWithHtml = (line) => {
    let formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const parts = formatted.split(/(<\/?[a-zA-Z0-9]+>)/g);
    let isBold = false;
    let isItalic = false;

    return parts.map((part, index) => {
      if (part === '<strong>') {
        isBold = true;
        return null;
      }
      if (part === '</strong>') {
        isBold = false;
        return null;
      }
      if (part === '<em>') {
        isItalic = true;
        return null;
      }
      if (part === '</em>') {
        isItalic = false;
        return null;
      }
      if (part.startsWith('<') && part.endsWith('>')) {
        return null;
      }

      if (isBold && isItalic) {
        return <strong key={index}><em>{part}</em></strong>;
      }
      if (isBold) {
        return <strong key={index}>{part}</strong>;
      }
      if (isItalic) {
        return <em key={index}>{part}</em>;
      }
      return part;
    }).filter(Boolean);
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />;

      if (trimmed.startsWith('# ')) {
        return <h2 key={i} className="text-xl font-bold text-IPCprimary mt-4 mb-2">{parseLineWithHtml(trimmed.substring(2))}</h2>;
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={i} className="text-lg font-bold text-IPCprimary mt-3.5 mb-1.5">{parseLineWithHtml(trimmed.substring(3))}</h3>;
      }
      if (trimmed.startsWith('### ')) {
        return <h4 key={i} className="text-base font-bold text-IPCprimary mt-3 mb-1">{parseLineWithHtml(trimmed.substring(4))}</h4>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={i} className="ml-5 list-disc my-1 text-gray-700">{parseLineWithHtml(trimmed.substring(2))}</li>;
      }
      
      const numListMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
      if (numListMatch) {
        return <li key={i} className="ml-5 list-decimal my-1 text-gray-700">{parseLineWithHtml(numListMatch[2])}</li>;
      }

      return <p key={i} className="mb-2 leading-relaxed text-gray-700">{parseLineWithHtml(line)}</p>;
    });
  };

  const StampResultCard = ({ data }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    return (
      <div className="bg-white rounded-xl border border-IPCprimary/10 shadow-md max-w-lg overflow-hidden my-2 text-black">
        <div className="bg-IPCprimary text-white px-4 py-2.5 flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5 text-sm"><Camera size={16} /> Scanned Stamp Result</span>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">AI Verified</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <Camera size={24} className="text-gray-400" />
            </div>
            <div>
              <h4 className="font-bold text-IPCprimary leading-tight">{data.title || 'Unidentified Stamp'}</h4>
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                <Globe size={12} /> {data.country || 'Unknown Country'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 border border-gray-150 p-2 rounded-lg flex items-center gap-1.5">
              <Calendar size={14} className="text-IPCaccent" />
              <div>
                <span className="text-[10px] text-gray-500 block leading-none">Year</span>
                <span className="font-semibold text-IPCprimary">{data.year || 'N/A'}</span>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-150 p-2 rounded-lg flex items-center gap-1.5">
              <Award size={14} className="text-IPCaccent" />
              <div>
                <span className="text-[10px] text-gray-500 block leading-none">Condition</span>
                <span className="font-semibold text-IPCprimary">{data.condition || 'N/A'}</span>
              </div>
            </div>
          </div>

          {data.category && data.category.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.category.map((cat, idx) => (
                <span key={idx} className="text-[10px] bg-IPCprimary/10 text-IPCprimary font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Tag size={8} /> {cat}
                </span>
              ))}
            </div>
          )}

          {data.description && (
            <div className="border border-IPCaccent/15 rounded-lg overflow-hidden mt-1 text-xs">
              <button 
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="w-full flex items-center justify-between p-2 bg-IPCaccent/5 font-semibold text-IPCprimary"
              >
                <span>Historical Context</span>
                <ChevronRight size={14} className={`transition-transform ${isInfoOpen ? 'rotate-90' : ''}`} />
              </button>
              {isInfoOpen && (
                <div className="p-2.5 bg-white border-t border-IPCaccent/15 max-h-[140px] overflow-y-auto leading-relaxed text-gray-700">
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
    <SidebarProvider className="h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] w-full overflow-hidden"
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <Sidebar collapsible="offcanvas" className="mt-14 h-[calc(100%-3.5rem)] bg-IPCprimary">
        <SidebarHeader className="border-b border-IPCtext/20 p-4 flex flex-row items-center justify-between shrink-0 bg-IPCprimary text-white">
          <h3 className="font-bold text-sm flex items-center gap-1.5 text-IPCtext">
            <History size={16} /> Chat Sessions
          </h3>
          <button 
            onClick={startNewSession} 
            className="p-1.5 hover:bg-white/10 rounded-lg text-IPCtext hover:text-white transition-colors"
            title="New chat"
          >
            <Plus size={16} />
          </button>
        </SidebarHeader>
        <SidebarContent className="p-2 flex flex-col gap-1 select-none bg-IPCprimary text-IPCtext">
          <SidebarMenu>
            {isLoadingSessions ? (
              <div className="flex items-center justify-center p-8 gap-2 text-IPCtext text-xs">
                <Loader2 className="animate-spin" size={14} /> Loading chats...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center p-8 text-IPCtext/60 text-xs font-light">
                No sessions found. Start a new chat!
              </div>
            ) : (
              sessions.map((sess) => (
                <SidebarMenuItem key={sess.sessionId}>
                  <SidebarMenuButton
                    asChild
                    isActive={sessionId === sess.sessionId}
                    className={`w-full justify-between data-[active=true]:bg-IPCaccent data-[active=true]:text-white p-2.5 rounded-lg group text-IPCtext hover:bg-white/5 hover:text-white`}
                    onClick={() => {
                      if (editingSessionId !== sess.sessionId) {
                        setSessionId(sess.sessionId);
                      }
                    }}
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
                          className="text-xs bg-white text-black px-2 py-1 rounded w-full outline-none"
                        />
                      ) : (
                        <>
                          <div className="flex items-center gap-2 overflow-hidden flex-1">
                            <MessageSquare size={14} className="shrink-0" />
                            <span className="text-xs truncate">{sess.title || 'Untitled Chat'}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSessionId(sess.sessionId);
                                setEditingTitleText(sess.title || 'Untitled Chat');
                              }}
                              className="p-1 hover:bg-black/25 rounded text-inherit transition-colors"
                              title="Rename chat"
                            >
                              <Edit size={12} />
                            </button>
                            <button 
                              onClick={(e) => deleteSession(e, sess.sessionId)}
                              className="p-1 hover:bg-black/25 rounded text-inherit transition-colors"
                              title="Delete chat"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col bg-white/40 backdrop-blur-md relative h-[calc(100vh-3.5rem)] overflow-hidden">
        
        {/* Top bar */}
        <div className="h-14 bg-white/70 border-b border-gray-200 px-4 flex items-center justify-between shrink-0 backdrop-blur">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-IPCprimary" />
            <h2 className="font-bold text-IPCprimary flex items-center gap-1.5 text-lg">
              <Bot className="text-IPCsecondary shrink-0" /> Philabot Studio
            </h2>
          </div>
        </div>

        {!sessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50/50">
            <div className="max-w-md flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-4 bg-IPCprimary/10 text-IPCprimary rounded-full">
                <Bot size={40} className="text-IPCsecondary" />
              </div>
              <h3 className="text-xl font-bold text-IPCprimary font-serif">Philabot Studio</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-serif">
                Connect with Philabot, your specialized Philately AI Assistant. Scan stamps to analyze details or ask anything about stamp history and collections.
              </p>
              <button
                onClick={startNewSession}
                className="mt-2 w-full py-3 bg-IPCaccent hover:bg-IPCprimary text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-serif"
              >
                <Plus size={18} /> Start a New Chat
              </button>
            </div>
          </div>
        ) : (
          <>

        {/* Message Feed */}
        <div ref={chatFeedRef} className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50/50 flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.isStampCard ? (
                <StampResultCard data={msg.stampData} />
              ) : (
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-IPCaccent text-white rounded-br-none'
                      : 'bg-white border border-gray-150 text-gray-800 rounded-bl-none font-serif'
                  }`}
                >
                  {msg.sender === 'ai' && msg.text === '' ? (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2.5 h-2.5 bg-IPCsecondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 bg-IPCsecondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2.5 h-2.5 bg-IPCsecondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                  ) : (
                    <div className="text-sm leading-relaxed">
                      {formatText(msg.text)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-150 shrink-0">
            <p className="text-[11px] text-gray-500 mb-2 font-semibold uppercase tracking-wider">Suggested topics:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(prompt)}
                  className="text-xs bg-white hover:bg-IPCaccent/15 border border-gray-200 hover:border-IPCaccent text-IPCprimary font-medium py-1.5 px-3 rounded-full transition-all cursor-pointer shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Container */}
        <div className="p-4 border-t border-gray-200 bg-white/80 shrink-0 backdrop-blur">
          
          {/* File Upload Preview bar */}
          {previewUrl && (
            <div className="mb-3 p-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <img src={previewUrl} alt="Upload preview" className="w-12 h-12 object-contain bg-white rounded border border-gray-200" />
                <div>
                  <span className="text-xs font-semibold text-IPCprimary block">Stamp Attachment Ready</span>
                  <input
                    type="text"
                    placeholder="User note context (optional)..."
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    className="text-[11px] text-black bg-transparent border-none outline-none w-56 placeholder-gray-400 mt-0.5"
                  />
                </div>
              </div>
              <button 
                onClick={clearAttachment} 
                className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Input control */}
          <div className="flex gap-2 items-center bg-gray-50 border border-gray-300 rounded-2xl px-4 py-2 focus-within:border-IPCaccent focus-within:ring-1 focus-within:ring-IPCaccent transition-all">
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-IPCaccent hover:text-IPCprimary hover:bg-gray-200/50 rounded-full transition-colors cursor-pointer"
              title="Add stamp image"
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <input
              type="text"
              placeholder={isScanning ? "AI is recognizing your stamp..." : "Message AI assistant or ask about stamp..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isChatLoading && !isScanning && handleSendChat()}
              disabled={isChatLoading || isScanning}
              className="flex-1 bg-transparent border-none outline-none py-1.5 text-sm text-black placeholder-gray-400"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={isChatLoading || isScanning || (!inputText.trim() && !selectedFile)}
              className="p-2 bg-IPCaccent hover:bg-IPCprimary text-white rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow"
            >
              {isScanning ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
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
