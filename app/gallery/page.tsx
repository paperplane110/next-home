import Image from "next/image"
import path from "path"
import fs from "fs"
import exifr from "exifr"

export default async function GalleryPage() {
  const dir = path.join(process.cwd(), "public/img/gallery")
  const files = await fs.promises.readdir(dir)
  const images = files.filter((f) => /\.(jpe?g|png|webp|tiff)$/i.test(f))

  const imgList = await Promise.all(
    images.map(async (file) => {
      const src = `/img/gallery/${file}`
      const buffer = await fs.promises.readFile(path.join(dir, file))
      let meta: any = {}
      try {
        meta = await exifr.parse(buffer)
      } catch {}

      const device = [meta?.Make, meta?.Model].filter(Boolean).join(" ")
      const aperture =
        typeof meta?.FNumber === "number" ? `f/${meta.FNumber.toFixed(1)}` : undefined
      const focalLength =
        typeof meta?.FocalLength === "number" ? `${Math.round(meta.FocalLength)}mm` : undefined
      const exposure =
        typeof meta?.ExposureTime === "number"
          ? meta.ExposureTime < 1
            ? `1/${Math.round(1 / meta.ExposureTime)}`
            : `${Math.round(meta.ExposureTime)}s`
          : undefined
      const iso = meta?.ISO

      return { src, alt: file, device, aperture, focalLength, exposure, iso }
    })
  )

  return (
    <div className="section pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <header className="border h-full lg:row-span-2 ">
        <h1 className="font-serif font-light soft-70">
          Gallery
        </h1>
      </header>
      {imgList.map((item, index) => (
        <div key={index}>
          <Image
            src={item.src}
            alt={item.alt}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="text-sm text-muted-foreground mt-2">
            {item.device && <span>{item.device}</span>}
            {item.aperture && <span> · {item.aperture}</span>}
            {item.focalLength && <span> · {item.focalLength}</span>}
            {item.exposure && <span> · {item.exposure}</span>}
            {item.iso && <span> · ISO {item.iso}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}