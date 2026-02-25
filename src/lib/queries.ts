import { useQuery } from "@tanstack/react-query";
import { fetchHeroContent, fetchHeroFeature } from "./apis/home-page/heroApi";
import { fetchSlideImage } from "./apis/home-page/slideApi";
import { fetchFooter, fetchWhyUs } from "./apis/home-page/whyUsApi";
import { fetchPlans } from "./apis/home-page/planApi";
import { fetchVideo, fetchVideoPodcast } from "./apis/home-page/advertsApi";
import { fetchClientSay } from "./apis/home-page/clientSayApi";
import { getUserList } from "./apis/dashboard/userApi";
import { fetchBookData, getChapterContentsFromBook, type TBook, type TContents, type TTopics } from "./api";

export const useHeroContent = () => {
  return useQuery({
    queryKey: ["hero-contents"],
    queryFn: () => fetchHeroContent(),
  });
};

export const useHeroFeature = () => {
  return useQuery({
    queryKey: ["hero-features"],
    queryFn: () => fetchHeroFeature(),
  });
};

export const useSlideImage = () => {
  return useQuery({
    queryKey: ["slide-images"],
    queryFn: () => fetchSlideImage(),
  });
};

export const useWhyUs = () => {
  return useQuery({
    queryKey: ["why-us"],
    queryFn: () => fetchWhyUs(),
  });
};

export const usePlan = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => fetchPlans(),
  });
};

export const useAdverts = () => {
  return useQuery({
    queryKey: ["adverts"],
    queryFn: () => fetchVideo()
  })
}
export const useClientSay = () => {
  return useQuery({
    queryKey: ["client-say"],
    queryFn: () => fetchClientSay()
  })
}
export const useFooter = () => {
  return useQuery({
    queryKey: ["footer"],
    queryFn: () => fetchFooter()
  })
}
export const usePodcast = () => {
  return useQuery({
    queryKey: ["podcasting"],
    queryFn: () => fetchVideoPodcast()
   })
}


export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ["company", "user", "system-user"],
    queryFn: () => getUserList()
  })
}




export const useBook = (bookId: string | undefined) => {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => {
      if (!bookId) throw new Error("Book ID is required");
      return fetchBookData(bookId);
    },
    enabled: !!bookId,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useBookById = (bookId: string | undefined) => {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID is required");
      return fetchBookData(bookId);
    },
    enabled: !!bookId,
    staleTime: 5 * 60_000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useFirstChapterId = (bookId: string | undefined) => {
  return useQuery({
    queryKey: ["first-chapter", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID is required");
      
      const bookData = await fetchBookData(bookId);
      const book = bookData.data;
      
      if (book && book.topics && book.topics.length > 0) {
        // Find first topic
        const firstTopic = book.topics[0];
        return firstTopic.id.toString();
      }
      
      throw new Error(`No topics found for book ${bookId}`);
    },
    enabled: !!bookId,
    staleTime: 5 * 60_000,
  });
};

const findTopicInTree = (topics: TTopics[], targetId: string): TTopics | undefined => {
  if (!topics || topics.length === 0) return undefined;

  for (const topic of topics) {
    if (topic.id.toString() === targetId) {
      return topic;
    }
    if (topic.children && topic.children.length > 0) {
      const found = findTopicInTree(topic.children, targetId);
      if (found) return found;
    }
  }
  return undefined;
};

interface ChapterResponse {
  message: string;
  data: {
    id: number | string;
    title?: string;
    title_en?: string;
    title_kh?: string;
    title_ch?: string;
    contents: TContents[];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export const useChapterById = (bookId: string | undefined, chapterId: string | undefined) => {
  return useQuery<ChapterResponse, Error>({
    queryKey: ["chapter", bookId, chapterId],
    enabled: !!bookId && !!chapterId,
    queryFn: async (): Promise<ChapterResponse> => {
      if (!bookId) throw new Error("Book ID is required");
      if (!chapterId) throw new Error("Chapter ID is required");
      
      const bookData = await fetchBookData(bookId);
      const book = bookData.data;
      
      if (!book.topics || book.topics.length === 0) {
        return {
          message: "No topics found",
          data: {
            id: chapterId,
            title: "",
            contents: []
          }
        };
      }
      
      const topic = findTopicInTree(book.topics, chapterId);
      
      if (!topic) {
        return {
          message: "Topic not found",
          data: {
            id: chapterId,
            title: "",
            contents: []
          }
        };
      }
      
      const contents = getChapterContentsFromBook(book, chapterId) ?? [];
      
      return {
        message: "Success",
        data: {
          ...topic,
          contents: contents
        }
      };
    },
    staleTime: 5 * 60000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useChapterWithContents = (book: TBook | undefined, chapterId: string | undefined) => {
  return useQuery({
    queryKey: ["chapter-contents", book?.id, chapterId],
    enabled: !!book && !!chapterId,
    queryFn: (): ChapterResponse => {
      if (!book) throw new Error("Book is required");
      if (!chapterId) throw new Error("Chapter ID is required");
      
      if (!book.topics || book.topics.length === 0) {
        return {
          message: "Success",
          data: {
            id: chapterId,
            title: "",
            contents: []
          }
        };
      }
      
      const topic = findTopicInTree(book.topics, chapterId);
      
      if (!topic) {
        return {
          message: "Success",
          data: {
            id: chapterId,
            title: "",
            contents: []
          }
        };
      }
      
      const contents = getChapterContentsFromBook(book, chapterId);
      
      return {
        message: "Success",
        data: {
          ...topic,
          contents: contents
        }
      };
    },
    staleTime: 5 * 60000,
    retry: false,
  });
};