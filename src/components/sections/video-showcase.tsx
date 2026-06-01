"use client"

import { Container } from "@/components/layout/container"

const VIDEOS = [
  { src: "/video/product1.mp4", title: "Product 1" },
  { src: "/video/product2.mp4", title: "Product 2" },
  { src: "/video/product3.mp4", title: "Product 3" },
  { src: "/video/product4.mp4", title: "Product 4" },
]

function VideoShowcase() {
  return (
    <section aria-label="Product videos" className="bg-[var(--color-bg)]">

      <div className="grid grid-cols-2 md:grid-cols-4">
        {VIDEOS.map((video, i) => (
          <div key={i} className="group relative aspect-[3/3] overflow-hidden bg-black">
            <video
              src={video.src}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export { VideoShowcase }
