import { useQuery } from "@tanstack/react-query";
import { fetchHeroContent, fetchHeroFeature } from "./apis/home-page/heroApi";
import { fetchSlideImage } from "./apis/home-page/slideApi";
import { fetchFooter, fetchWhyUs } from "./apis/home-page/whyUsApi";
import { fetchPlans } from "./apis/home-page/planApi";
import { fetchVideo, fetchVideoPodcast } from "./apis/home-page/advertsApi";
import { fetchClientSay } from "./apis/home-page/clientSayApi";

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