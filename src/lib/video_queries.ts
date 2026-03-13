import { videoApi, type VideoItem as BaseVideoItem, type ApiResponse } from "../lib/api";

// ========== Extend VideoItem to include children_recursive ==========

export interface VideoItem extends BaseVideoItem {
  children_recursive?: VideoItem[];
}

export type { ApiResponse };

export interface VideoQueryParams {
  language?: string;
  status?: number;
  parent_id?: number | null;
  company_id?: string;
  page?: number;
  limit?: number;
  search?: string;
  endpoint?: "help_center" | "help_center_video";
}

// ========== Query Keys ==========

export const videoQueryKeys = {
  all: ["videos"] as const,
  lists: () => [...videoQueryKeys.all, "list"] as const,
  list: (filters?: VideoQueryParams) =>
    [...videoQueryKeys.lists(), filters] as const,
  details: () => [...videoQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...videoQueryKeys.details(), id] as const,
  tree: () => [...videoQueryKeys.all, "tree"] as const,
  byCompany: (companyId: string, filters?: VideoQueryParams) =>
    [...videoQueryKeys.all, "company", companyId, filters] as const,
};

// ========== Queries ==========

export const videoQueries = {
  // GET /help_center_video?company_id=xxx → returns tree with children_recursive
  getVideoTree: (params?: VideoQueryParams) => ({
    queryKey: videoQueryKeys.tree(),
    queryFn: async (): Promise<ApiResponse<VideoItem[]>> => {
      const response = await videoApi.getVideoTree(params?.endpoint);
      if (response.success && !response.data) {
        return { ...response, data: [] };
      }
      return response as ApiResponse<VideoItem[]>;
    },
    staleTime: 5 * 60 * 1000,
  }),

  // GET /help_center_video/:id
  getVideoById: (id: number) => ({
    queryKey: videoQueryKeys.detail(id),
    queryFn: async (): Promise<ApiResponse<VideoItem>> => {
      const response = await videoApi.getVideoById(id);
      return response as ApiResponse<VideoItem>;
    },
    staleTime: 10 * 60 * 1000,
  }),

  // GET /help_center_video?...filters
  getVideos: (params?: VideoQueryParams) => ({
    queryKey: videoQueryKeys.list(params),
    queryFn: async (): Promise<ApiResponse<VideoItem[]>> => {
      const response = await videoApi.getVideos(params);
      if (response.success && !response.data) {
        return { ...response, data: [] };
      }
      return response as ApiResponse<VideoItem[]>;
    },
    staleTime: 5 * 60 * 1000,
  }),
};

// ========== Tree Item with level ==========

export interface VideoTreeItem extends VideoItem {
  children_recursive?: VideoTreeItem[];
  level?: number;
}

// ========== Utils ==========

export const videoUtils = {
  /**
   * API return children_recursive រួចស្រេច
   * function នេះ inject level តែប៉ុណ្ណោះ
   */
  addLevels: (items: VideoItem[], level: number = 0): VideoTreeItem[] => {
    if (!items || items.length === 0) return [];

    return [...items]
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({
        ...item,
        level,
        children_recursive: item.children_recursive
          ? videoUtils.addLevels(item.children_recursive, level + 1)
          : [],
      }));
  },

  /**
   * Flatten tree (children_recursive) ទៅជា flat array
   */
  flattenTree: (items: VideoTreeItem[]): VideoItem[] => {
    if (!items || items.length === 0) return [];

    return items.reduce<VideoItem[]>((acc, item) => {
      const { children_recursive, ...rest } = item;
      acc.push(rest as VideoItem);
      if (children_recursive && children_recursive.length > 0) {
        acc.push(...videoUtils.flattenTree(children_recursive));
      }
      return acc;
    }, []);
  },

  /**
   * រក item តាម id ក្នុង nested tree
   */
  findById: (items: VideoItem[], id: number): VideoItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children_recursive?.length) {
        const found = videoUtils.findById(item.children_recursive, id);
        if (found) return found;
      }
    }
    return null;
  },

  getLocalizedName: (item: VideoItem, language: string = "en"): string => {
    if (!item) return "Unknown Video";
    switch (language) {
      case "kh":
        return item.name_kh?.trim() || item.name_en?.trim() || `Video ${item.id}`;
      case "ch":
        return item.name_ch?.trim() || item.name_en?.trim() || `Video ${item.id}`;
      default:
        return item.name_en?.trim() || `Video ${item.id}`;
    }
  },

  getLocalizedVideoTitle: (item: VideoItem, language: string = "en"): string => {
    if (!item) return "Unknown Video";
    const titleMap: Record<string, string | null | undefined> = {
      en: item.video_title_en,
      kh: item.video_title_kh,
      ch: item.video_title_ch,
    };
    const title = titleMap[language] ?? item.video_title_en;
    return title?.trim() || item.name_en?.trim() || `Video ${item.id}`;
  },

  extractYouTubeId: (url: string | null): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  },

  getYouTubeThumbnail: (
    videoId: string,
    quality: "default" | "medium" | "high" | "maxres" = "maxres",
  ): string => {
    const qualities = {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium:  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high:    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      maxres:  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
    return qualities[quality];
  },

  isValidYouTubeUrl: (url: string | null): boolean => {
    if (!url) return false;
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(www\.)?(m\.youtube\.com)\/.+$/,
    ];
    return patterns.some((p) => p.test(url));
  },
};

export default videoQueries;