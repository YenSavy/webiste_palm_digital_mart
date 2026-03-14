import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCheck,
  MessageCircle,
  Paperclip,
  Phone,
  Send,
  Video,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import useMainStore from "../../store/mainStore";

type MessageStatus = "sent" | "delivered" | "read";
type Sender = "me" | "them";

type MessageItem = {
  id: string;
  text: string;
  time: string;
  sender: Sender;
  status?: MessageStatus;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  online: boolean;
  messages: MessageItem[];
};

const Messages: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const search = useMainStore((state) => state.search);
  const [composerText, setComposerText] = useState("");

  const conversations = useMemo<Conversation[]>(
    () => [
      {
        id: "msg-001",
        name: "Finance Team",
        role: "Internal Team",
        lastMessage: "Invoice summary is ready for your review.",
        lastMessageAt: "09:14",
        unreadCount: 2,
        online: true,
        messages: [
          { id: "m-1", text: "Please update the February numbers.", time: "08:43", sender: "them" },
          {
            id: "m-2",
            text: "Done. I attached the revised sheet in the report folder.",
            time: "08:50",
            sender: "me",
            status: "read",
          },
          { id: "m-3", text: "Invoice summary is ready for your review.", time: "09:14", sender: "them" },
        ],
      },
      {
        id: "msg-002",
        name: "Warehouse Supervisor",
        role: "Operations",
        lastMessage: "Stock movement file uploaded.",
        lastMessageAt: "Yesterday",
        unreadCount: 0,
        online: false,
        messages: [
          { id: "m-4", text: "Any delay in item delivery?", time: "Yesterday 10:05", sender: "me", status: "read" },
          { id: "m-5", text: "Stock movement file uploaded.", time: "Yesterday 10:17", sender: "them" },
        ],
      },
      {
        id: "msg-003",
        name: "Support Bot",
        role: "Automation",
        lastMessage: "Your subscription renewal is in 4 days.",
        lastMessageAt: "Mon",
        unreadCount: 1,
        online: true,
        messages: [
          { id: "m-6", text: "Your subscription renewal is in 4 days.", time: "Mon 11:00", sender: "them" },
        ],
      },
    ],
    [],
  );

  const filteredConversations = useMemo(() => {
    const term = search?.trim().toLowerCase() || "";
    if (!term) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(term) ||
        conversation.role.toLowerCase().includes(term) ||
        conversation.lastMessage.toLowerCase().includes(term),
    );
  }, [conversations, search]);

  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id ?? "");

  const activeConversation = useMemo(
    () =>
      filteredConversations.find((conversation) => conversation.id === activeConversationId) ??
      filteredConversations[0] ??
      null,
    [activeConversationId, filteredConversations],
  );

  const getStatusIcon = (status?: MessageStatus) => {
    if (status === "read") return <CheckCheck size={14} className="text-blue-500" />;
    if (status === "delivered") return <CheckCheck size={14} className={theme.textSecondary} />;
    return <Check size={14} className={theme.textSecondary} />;
  };

  const handleSend = () => {
    if (!composerText.trim()) return;
    setComposerText("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-4 sm:p-6`,
        )}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className={cn("text-xl sm:text-2xl font-bold", theme.text)}>Messages</h1>
            <p className={cn("mt-1 text-sm", theme.textSecondary)}>
              Chat with your teams and monitor latest updates.
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}12` }}
          >
            <MessageCircle size={16} style={{ color: theme.accent }} />
            <span className={cn("text-sm font-medium", theme.text)}>
              {filteredConversations.reduce((total, conv) => total + conv.unreadCount, 0)} unread
            </span>
          </div>
        </div>
      </section>

      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-3 sm:p-4`,
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[330px,1fr] gap-4">
          <aside className={cn(`rounded-xl border ${theme.border} overflow-hidden`)}>
            <div className={cn(`px-4 py-3 border-b ${theme.border}`, theme.text)}>
              <p className="text-sm font-semibold">Conversations</p>
            </div>
            <div className="max-h-[62vh] overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const isActive = activeConversation?.id === conversation.id;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversationId(conversation.id)}
                    className={cn(`w-full text-left p-4 border-b ${theme.border} transition-colors`)}
                    style={{
                      backgroundColor: isActive ? `${theme.accent}18` : "transparent",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-semibold truncate", theme.text)}>{conversation.name}</p>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: conversation.online ? "#22c55e" : "#94a3b8" }}
                          />
                        </div>
                        <p className={cn("text-xs mt-0.5", theme.textSecondary)}>{conversation.role}</p>
                        <p className={cn("text-xs mt-1 truncate", theme.textSecondary)}>{conversation.lastMessage}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn("text-xs", theme.textSecondary)}>{conversation.lastMessageAt}</p>
                        {conversation.unreadCount > 0 && (
                          <span
                            className="inline-flex mt-1 min-w-5 h-5 px-1 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                            style={{ backgroundColor: theme.accent }}
                          >
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredConversations.length === 0 && (
                <p className={cn("px-4 py-10 text-center text-sm", theme.textSecondary)}>
                  No conversations match your search.
                </p>
              )}
            </div>
          </aside>

          <div className={cn(`rounded-xl border ${theme.border} overflow-hidden`)}>
            {activeConversation ? (
              <>
                <div className={cn(`px-4 py-3 border-b ${theme.border}`)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold truncate", theme.text)}>{activeConversation.name}</p>
                      <p className={cn("text-xs", theme.textSecondary)}>{activeConversation.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-9 h-9 rounded-lg border flex items-center justify-center"
                        style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
                      >
                        <Phone size={15} style={{ color: theme.accent }} />
                      </button>
                      <button
                        className="w-9 h-9 rounded-lg border flex items-center justify-center"
                        style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
                      >
                        <Video size={15} style={{ color: theme.accent }} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 h-[48vh] overflow-y-auto" style={{ backgroundColor: `${theme.accent}05` }}>
                  {activeConversation.messages.map((message) => {
                    const mine = message.sender === "me";
                    return (
                      <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                        <div
                          className="max-w-[80%] rounded-2xl px-3 py-2"
                          style={{
                            backgroundColor: mine ? `${theme.accent}22` : `${theme.accent}0f`,
                            border: `1px solid ${mine ? `${theme.accent}55` : `${theme.accent}33`}`,
                          }}
                        >
                          <p className={cn("text-sm break-words", theme.text)}>{message.text}</p>
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <p className={cn("text-[11px]", theme.textSecondary)}>{message.time}</p>
                            {mine && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={cn(`p-3 border-t ${theme.border}`)}>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
                      style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
                    >
                      <Paperclip size={15} style={{ color: theme.accent }} />
                    </button>
                    <input
                      value={composerText}
                      onChange={(event) => setComposerText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleSend();
                      }}
                      placeholder="Type a message..."
                      className={cn(`w-full rounded-lg border px-3 py-2 text-sm outline-none ${theme.text}`)}
                      style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                    />
                    <button
                      onClick={handleSend}
                      className="w-10 h-10 rounded-lg text-white flex items-center justify-center shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[60vh] flex items-center justify-center">
                <p className={cn("text-sm", theme.textSecondary)}>No conversation selected.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Messages;
