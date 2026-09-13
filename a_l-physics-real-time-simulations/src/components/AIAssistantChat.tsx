import React, { useState, useRef, useEffect } from "react";
import { PracticalItem, ChatMessage } from "../types";
import katex from "katex";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Globe,
  BrainCircuit,
  RotateCcw,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

interface Props {
  practical: PracticalItem;
  currentReadings: Record<string, number>;
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

function renderKatexMath(mathStr: string, isDisplay: boolean = false): string {
  try {
    return katex.renderToString(mathStr.trim(), {
      displayMode: isDisplay,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return mathStr;
  }
}

function renderFormattedMathString(text: string): string {
  // 1. Clean any raw markdown glitches
  let processed = text
    .replace(/\(\$y\s*=\s*mx\s*\+\s*c\$\)\*\*:\s*E/g, "($y = mx + c$): E")
    .replace(/\*\*:\s*/g, ": ");

  // 2. Render inline math $...$
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => renderKatexMath(math, false));

  // 3. Render paren inline math \(...\)
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => renderKatexMath(math, false));

  // 4. Render raw \frac{...}{...} that might not be wrapped in $
  processed = processed.replace(/(?:(?<![$\\]))(\\frac\{[^{}]+\}\{[^{}]+\})/g, (_, math) => {
    return renderKatexMath(math, false);
  });

  // 5. Convert markdown bold **...**
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  return processed;
}

function FormattedMessageText({ content }: { content: string }) {
  // Preserve multi-line display math blocks ($$...$$ and \[...\])
  const displayBlocks: string[] = [];
  const placeholderPrefix = "___KATEX_DISPLAY_BLOCK_";

  let sanitized = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const idx = displayBlocks.length;
    const html = `<div class="katex-display-container my-3 overflow-x-auto py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center shadow-inner">${renderKatexMath(
      math,
      true
    )}</div>`;
    displayBlocks.push(html);
    return `${placeholderPrefix}${idx}___`;
  });

  sanitized = sanitized.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
    const idx = displayBlocks.length;
    const html = `<div class="katex-display-container my-3 overflow-x-auto py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center shadow-inner">${renderKatexMath(
      math,
      true
    )}</div>`;
    displayBlocks.push(html);
    return `${placeholderPrefix}${idx}___`;
  });

  const lines = sanitized.split("\n");

  return (
    <div className="space-y-2 font-sans leading-relaxed text-slate-200 text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-0.5" />;

        // Display math placeholder
        if (trimmed.includes(placeholderPrefix)) {
          const match = trimmed.match(new RegExp(`${placeholderPrefix}(\\d+)___`));
          if (match) {
            const blockIndex = parseInt(match[1], 10);
            return (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: displayBlocks[blockIndex] }}
              />
            );
          }
        }

        // Header ###
        if (trimmed.startsWith("### ")) {
          const headerText = trimmed.replace("### ", "");
          return (
            <h4
              key={idx}
              className="font-bold text-cyan-300 text-xs sm:text-sm mt-3 mb-1 tracking-wide"
              dangerouslySetInnerHTML={{ __html: renderFormattedMathString(headerText) }}
            />
          );
        }
        if (trimmed.startsWith("## ")) {
          const headerText = trimmed.replace("## ", "");
          return (
            <h3
              key={idx}
              className="font-bold text-white text-sm sm:text-base mt-3.5 mb-1.5"
              dangerouslySetInnerHTML={{ __html: renderFormattedMathString(headerText) }}
            />
          );
        }

        // Bullet point lines: check for "○ ", "• ", "- ", "* "
        const isHollowCircle = trimmed.startsWith("○ ");
        const isStandardBullet =
          trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ");

        if (isHollowCircle || isStandardBullet) {
          const rawBulletContent = trimmed.replace(/^(○|•|-|\*)\s+/, "");
          const formattedHtml = renderFormattedMathString(rawBulletContent);

          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 py-0.5">
              <span className="text-cyan-400 text-sm font-semibold select-none mt-[-1px] shrink-0">
                ○
              </span>
              <div
                className="flex-1 leading-relaxed text-slate-200"
                dangerouslySetInnerHTML={{ __html: formattedHtml }}
              />
            </div>
          );
        }

        // Numbered list: 1. , 2.
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberMatch) {
          const num = numberMatch[1];
          const rawContent = numberMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="font-mono text-cyan-400 font-bold text-xs mt-0.5 shrink-0">
                {num}.
              </span>
              <div
                className="flex-1 leading-relaxed text-slate-200"
                dangerouslySetInnerHTML={{ __html: renderFormattedMathString(rawContent) }}
              />
            </div>
          );
        }

        // Standard paragraph
        return (
          <p
            key={idx}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderFormattedMathString(trimmed) }}
          />
        );
      })}
    </div>
  );
}

export const AIAssistantChat: React.FC<Props> = ({
  practical,
  currentReadings,
  isOpen,
  onClose,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: `Hello! I'm your AI Physics Lab Tutor, calibrated for **${practical.title}** (Exp #${practical.number}).

You can ask me to solve step-by-step calculations, derive straight-line equations ($y = mx + c$), evaluate gradient slopes ($m = \\frac{\\Delta y}{\\Delta x}$), or verify intervals and inequalities!`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [enableThinking, setEnableThinking] = useState(true);
  const [enableSearch, setEnableSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSend(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          practicalContext: {
            id: practical.id,
            number: practical.number,
            title: practical.title,
            category: practical.category,
            formula: practical.formula,
            graphConfig: practical.graphConfig,
            currentReadings,
          },
          enableThinking,
          enableSearch,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      const replyContent =
        data.text ||
        data.reply ||
        (data.error
          ? `Advice: ${data.error}`
          : "I am ready to help with formulas, zero error, and graph gradients for this experiment.");

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: replyContent,
        timestamp: Date.now(),
        groundingChunks: data.groundingChunks || [],
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const fallbackText = `Here is essential guidance for ${practical.title}:
• Check for zero error and subtract it with its sign.
• Plot at least 5-6 points across a wide range.
• Relate the experimental gradient to the theoretical formula: ${practical.formula}`;

      const errorMsg: ChatMessage = {
        id: `info-${Date.now()}`,
        role: "model",
        content: fallbackText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeExperiment = async () => {
    if (loading) return;
    setLoading(true);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: `Analyze my current experimental trial readings for ${practical.title}. Check for systematic errors, theoretical validity, and provide exam tips.`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/analyze-experiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          practical,
          readings: currentReadings,
        }),
      });

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.analysis || "Analysis complete.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        content: `Error during experiment analysis: ${err.message}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950/95 border-l border-cyan-500/20 shadow-2xl backdrop-blur-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                AI Physics Lab Assistant
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-[240px]">
              Active: {practical.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setMessages([
                {
                  id: "welcome",
                  role: "model",
                  content: `Context refreshed for **${practical.title}**. What would you like to explore?`,
                  timestamp: Date.now(),
                },
              ])
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Controls Bar: Thinking Mode & Web Search */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEnableThinking(!enableThinking)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              enableThinking
                ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300 font-medium"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
            title="Enable Gemini deep reasoning for step-by-step mathematical derivations"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span className="text-[11px]">Thinking Mode</span>
          </button>

          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              enableSearch
                ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
            title="Ground answers with Google Search for latest exam papers"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[11px]">Search Grounding</span>
          </button>
        </div>

        <button
          onClick={handleAnalyzeExperiment}
          disabled={loading}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 hover:underline disabled:opacity-50"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Analyze Trial
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20"
                  : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none backdrop-blur-md"
              }`}
            >
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
              ) : (
                <FormattedMessageText content={msg.content} />
              )}

              {/* Citations / Grounding sources */}
              {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Web Sources
                  </div>
                  <ul className="space-y-0.5">
                    {msg.groundingChunks.map((chunk, idx) => (
                      <li key={idx} className="truncate">
                        <a
                          href={chunk.web?.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline"
                        >
                          {chunk.web?.title || chunk.web?.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900/90 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              <span>
                {enableThinking ? "Thinking deeply..." : "Synthesizing answer..."}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <button
          onClick={() =>
            handleSend(
              `What is the theoretical linear equation (y = mx + c) and gradient for ${practical.title}?`
            )
          }
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
        >
          📈 Graph & Gradient
        </button>
        <button
          onClick={() =>
            handleSend(
              `What are the most common student mistakes and structured essay exam traps in ${practical.title}?`
            )
          }
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
        >
          🎯 Exam Traps
        </button>
        <button
          onClick={() =>
            handleSend(
              `Explain step-by-step how to calibrate zero error for this apparatus.`
            )
          }
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
        >
          ⚙ Zero Error
        </button>
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${practical.title}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
