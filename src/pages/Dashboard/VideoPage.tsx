import React, { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Play, Menu,  } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import VideoTOC from '../../components/user-guide/VideoTOC';
import { useReaderStore } from "../../store/readerStore";
import videoQueries, { videoUtils } from "../../lib/video_queries";

const VideoPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get current video ID from URL params
  const currentVideoId = searchParams.get("videoId") || null;

  const language = useReaderStore((s) => s.language);
  const currentLang = (language as "kh" | "eng" | "ch") || "eng";

  const { data: videosResponse } = useQuery(videoQueries.getVideos({ status: 1 }));
  const videos = videosResponse?.success ? videosResponse.data || [] : [];

  // Find the currently selected video
  const currentVideo = currentVideoId
    ? videos.find((v) => String(v.id) === currentVideoId)
    : null;

  const getTitle = useCallback(
    (video: typeof currentVideo) => {
      if (!video) return "";
      const lang = currentLang === "eng" ? "en" : currentLang;
      return videoUtils.getLocalizedName(video, lang);
    },
    [currentLang]
  );

  const handleOpenVideo = useCallback(
    (videoId: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("videoId", videoId);
        return next;
      });
      setIsSidebarOpen(false);
    },
    [setSearchParams]
  );

  const handleClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const getEmbedUrl = useCallback(
    (url?: string | null) =>
      videoUtils.getYouTubeEmbedUrl(url || null, { rel: 0 }) ?? url ?? "",
    [],
  );

  const noVideoUI = {
    kh: {
      title: "ជ្រើសរើសវីដេអូ",
      subtitle: "ជ្រើសរើសវីដេអូពីម៉ឺនុយខាងឆ្វេង",
    },
    eng: {
      title: "Select a Video",
      subtitle: "Choose a video from the sidebar to start watching",
    },
    ch: {
      title: "选择视频",
      subtitle: "从侧边栏选择视频开始观看",
    },
  }[currentLang];

  const embedSrc = currentVideo ? getEmbedUrl(currentVideo.video_url) : "";
  const isYouTubeEmbed = embedSrc.startsWith("https://www.youtube.com/embed/");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — always visible on md+, togglable on mobile */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 md:static md:z-auto md:flex
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <VideoTOC
          currentVideoId={currentVideoId}
          onOpenVideo={handleOpenVideo}
          onClose={handleClose}
        />
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-card md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold truncate text-foreground">
            {currentVideo ? getTitle(currentVideo) : "PALM Tech Video Center"}
          </span>
        </div>

        {/* Video area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentVideo && currentVideo.video_url ? (
            <div className="max-w-5xl mx-auto space-y-4">
              {/* Video title */}
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {getTitle(currentVideo)}
              </h2>

              {/* Video player */}
              <div
                className="relative w-full rounded-xl overflow-hidden bg-black shadow-2xl"
                style={{ aspectRatio: "16/9" }}
              >
                {isYouTubeEmbed ? (
                  <iframe
                    key={currentVideo.id}
                    src={embedSrc}
                    title={getTitle(currentVideo)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <p className="text-white mb-3 font-semibold">Video cannot be embedded</p>
                    <a
                      href={currentVideo.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Watch externally
                    </a>
                  </div>
                )}
              </div>

              {/* Description / meta */}
              {(currentVideo.video_title_en ||
                currentVideo.video_title_kh ||
                currentVideo.video_title_ch) && (
                <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground space-y-1">
                  {currentLang === "eng" && currentVideo.video_title_en && (
                    <p>{currentVideo.video_title_en}</p>
                  )}
                  {currentLang === "kh" && currentVideo.video_title_kh && (
                    <p>{currentVideo.video_title_kh}</p>
                  )}
                  {currentLang === "ch" && currentVideo.video_title_ch && (
                    <p>{currentVideo.video_title_ch}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Play size={36} className="text-primary ml-1" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {noVideoUI.title}
                </h2>
                <p className="text-muted-foreground">{noVideoUI.subtitle}</p>
              </div>
              {/* Open sidebar on mobile from empty state */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Browse Videos
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
