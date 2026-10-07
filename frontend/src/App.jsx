import { useState } from "react";
import { Send, Sparkles, User, Bot } from "lucide-react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generateText(text) {
    setLoading(true);

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const assistantMessage = await CallServer(text);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantMessage,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function CallServer(inputText) {
    const response = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: inputText }),
    });

    if (!response.ok) {
      throw new Error("Error generating the response");
    }

    const result = await response.json();
    return result.message;
  }

  async function handleSubmit() {
    const text = input.trim();

    if (!text || loading) return;

    setInput("");
    await generateText(text);
  }

  async function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-white/10 bg-[#0b0b0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Sparkles size={18} />
            </div>

            <div>
              <h1 className="text-sm font-semibold sm:text-base">
                AI Assistant
              </h1>
              <p className="text-[11px] text-neutral-500">Powered by OpenAI</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-xs text-neutral-400">Online</span>
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-screen w-full max-w-4xl px-3 pb-36 pt-24 sm:px-5">
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
              <Sparkles className="text-violet-400" size={28} />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How can I help you?
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
              Ask me anything. I can help you understand concepts, write code,
              brainstorm ideas, or solve problems.
            </p>

            <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Explain React hooks",
                "Help me debug my code",
                "Give me project ideas",
                "Explain GenAI concepts",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-neutral-400 transition hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6 pb-20">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={index}
                className={`flex gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 sm:flex">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[75%] ${
                    isUser ? "order-1" : ""
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isUser
                        ? "rounded-br-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10"
                        : "rounded-bl-md border border-white/10 bg-white/[0.04] text-neutral-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 sm:flex">
                    <User size={15} className="text-neutral-400" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="hidden h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 sm:flex">
                <Bot size={16} />
              </div>

              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-4">
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/95 to-transparent px-3 pb-4 pt-8 sm:px-5">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#17171c]/95 shadow-2xl shadow-black/40 backdrop-blur-xl transition focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20">
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Assistant..."
              className="max-h-32 min-h-[52px] w-full resize-none bg-transparent px-4 pt-4 text-sm text-white outline-none placeholder:text-neutral-600"
            />

            <div className="flex items-center justify-between px-3 pb-3">
              <p className="hidden text-[11px] text-neutral-600 sm:block">
                Enter to send · Shift + Enter for new line
              </p>

              <button
                onClick={handleSubmit}
                disabled={!input.trim() || loading}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-neutral-600">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
