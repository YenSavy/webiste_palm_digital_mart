import { create } from "zustand";


export interface advertizeVideoType {
    id: string;
    src: string
    description: string
    createdAt: string
    updatedAt: string
    author: string
}
type VideoStoreType = {
    advertizeVideo:  advertizeVideoType[]
}

const videos_mock: advertizeVideoType[] = [
    {
        id: crypto.randomUUID(),
        src: "./video/adverts.mp4",
        author: "Palm Digital Biz",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        description: "Video AI showcase about the process of our Mart software service"
    },
    {
        id: crypto.randomUUID(),
        src: "./video/video2.mp4",
        author: "Palm Digital Biz",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        description: "Video AI showcase about the process of our Mart software service"
    },
    {
        id: crypto.randomUUID(),
        src: "./video/adverts.mp4",
        author: "Palm Digital Biz",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        description: "Video AI showcase about the process of our Mart software service"
    },
    {
        id: crypto.randomUUID(),
        src: "./video/adverts.mp4",
        author: "Palm Digital Biz",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        description: "Video AI showcase about the process of our Mart software service"
    },
    {
        id: crypto.randomUUID(),
        src: "./video/adverts.mp4",
        author: "Palm Digital Biz",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        description: "Video AI showcase about the process of our Mart software service"
    },
    {
        id: crypto.randomUUID(),
        src: "./video/adverts.mp4",
        author: "Palm Digital Biz",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        description: "Video AI showcase about the process of our Mart software service"
    },
    {
        id: crypto.randomUUID(),
        src: "./video/adverts.mp4",
        author: "Palm Digital Biz",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        description: "Video AI showcase about the process of our Mart software service"
    }
]

const useVideoStore = create<VideoStoreType>(() => ({
    advertizeVideo: videos_mock
}))

export default useVideoStore;