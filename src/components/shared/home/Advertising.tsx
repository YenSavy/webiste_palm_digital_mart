import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextTitle from "../../TextTitle";
import { Megaphone } from "lucide-react";
import useLangSwitch from "../../../hooks/useLangSwitch";

export type TVideoType = {
  id: string;
  title_en: string;
  title_kh: string;
  title_ch: string;
  thumbnail: string;
  video_url: string;
  channel_name: string;
  created_at: string;
};

interface AdvertisingProps {
  videos?: TVideoType[];
  defaultLatestVideo: TVideoType;
}


//helper func
const getYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/");
      const last = parts[parts.length - 1];
      if (last) return last;
    }

    return null;
  } catch {
    return null;
  }
};

const isYouTubeUrl = (url?: string) =>
  !!url && (url.includes("youtube.com") || url.includes("youtu.be"));


const Advertising: React.FC<AdvertisingProps> = ({
  videos = [],
  defaultLatestVideo,
}) => {
  const { t } = useTranslation("common");
  const [latestVideo, setLatestVideo] = useState<TVideoType | undefined>();

  useEffect(() => {
    if (defaultLatestVideo) {
      setLatestVideo(defaultLatestVideo);
    }
  }, [defaultLatestVideo]);

  const currentVideo = latestVideo ?? defaultLatestVideo;

  const otherVideos =
    videos && currentVideo
      ? videos.filter((v) => v.id !== currentVideo.id)
      : [];

  const latestIsYouTube = isYouTubeUrl(currentVideo?.video_url);
  const latestEmbedId =
    currentVideo?.video_url && getYouTubeId(currentVideo.video_url);
  const latestEmbedUrl = latestEmbedId
    ? `https://www.youtube.com/embed/${latestEmbedId}`
    : "";

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <section className="mt-7 px-0 flex flex-col items-center justify-center gap-5">
        <TextTitle
          title={t("common:advertise")}
          icon={<Megaphone size={34} />}
        />

        <article className="flex flex-col lg:flex-row w-full gap-6" data-aos="fade-right">
          {/* MAIN VIDEO */}
          <div className="flex-[3] flex flex-col">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-lg">
              {currentVideo && latestIsYouTube && latestEmbedUrl ? (
                <div className="w-full aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={latestEmbedUrl}
                    title={currentVideo.title_en || "YouTube video player"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  className="w-full aspect-video object-cover"
                  autoPlay
                  loop
                  muted
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  controls
                  src={currentVideo?.video_url}
                />
              )}
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-xl font-semibold text-gray-100">
                {currentVideo &&
                  useLangSwitch(
                    currentVideo.title_en,
                    currentVideo.title_kh,
                    currentVideo.title_ch
                  )}
              </h3>

              <div className="flex flex-wrap gap-4 text-smtext-gray-400 pt-2">
                <span className="flex items-center gap-1">

                  {currentVideo?.channel_name}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">{t("common:created_at")}:</span>
                  {currentVideo?.created_at}
                </span>
              </div>
            </div>
          </div>

          {/* SIDEBAR LIST */}
          {otherVideos.length > 0 && (
            <div className="flex-[2] flex flex-col h-[500px]" data-aos="fade-left">
              <h3 className="font-semibold border-b py-3">
                {t("common:other_video")}
              </h3>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mt-2">
                {otherVideos.map((video) => {
                  const youTubeId = getYouTubeId(video.video_url);
                  const youTubeThumb =
                    video.thumbnail ||
                    (youTubeId
                      ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
                      : "");

                  const displayTitle = useLangSwitch(
                    video.title_en,
                    video.title_kh,
                    video.title_ch
                  );

                  return (
                    <button
                      type="button"
                      key={video.id}
                      onClick={() => setLatestVideo(video)}
                      className="w-full text-left flex gap-3 p-3 rounded-lg hover:bg-gray-100 bg-gradient-primary transition-colors"
                    >
                      <div className="flex-shrink-0 w-32 h-20 bg-black rounded-md overflow-hidden">
                        {isYouTubeUrl(video.video_url) && youTubeThumb ? (
                          <img
                            src={youTubeThumb}
                            alt={displayTitle || "Video thumbnail"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            className="w-full h-full object-cover"
                            src={video.video_url}
                            preload="metadata"
                            muted
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                          {displayTitle}
                        </p>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="truncate">
                              {video.channel_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {t("common:created_at")}:
                            </span>
                            <span className="truncate">{video.created_at}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </section>
    </>
  );
};

export default Advertising;
