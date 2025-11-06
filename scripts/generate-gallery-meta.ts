import fs from "node:fs/promises"
import path from "node:path"
import exifr from "exifr"
import { format } from "date-fns"

type ImageInfo = {
    src: string,
    alt: string,
    device?: string,
    date?: string,
    location?: string
}

const galleryDir = path.join(process.cwd(), "public/img/gallery");
const outFile = path.join(galleryDir, "meta.json");

async function loadExistingMeta() {
    try {
        const json = await fs.readFile(outFile, "utf-8")
        const data = JSON.parse(json)
        return Array.isArray(data) ? (data as ImageInfo[]) : []
    } catch {
        return []
    }
}

const isImage = (file: string) => /\.(jpe?g|png|gif|webf|tiff)$/i.test(file);

async function main() {
    const existing = await loadExistingMeta()
    const existingSrcSet = new Set(existing.map((info) => info.src))

    const files = await fs.readdir(galleryDir);
    const images = files.filter(isImage);

    const newEntries = [];
    for (const file of images) {
        const absPath = path.join(galleryDir, file);
        const src = `/img/gallery/${file}`
        if (existingSrcSet.has(src)) {
            continue;
        }

        let meta: any = {};
        try {
            const buffer = await fs.readFile(absPath);
            meta = (await exifr.parse(buffer, {
                pick: ["Model", "FocalLength", "DateTimeOriginal"]
            })) ?? {};
        } catch (e) {
            console.error(`Parse meta info failed: ${absPath}, reason: ${e}`)
        }

        const device = meta?.Model
        const date = meta?.DateTimeOriginal instanceof Date 
            ? format(meta.DateTimeOriginal, "yyyy/MM/dd")
            : undefined
        console.log(date)
        newEntries.push({
            src,
            alt: path.parse(absPath).name,
            device,
            date
        })
    }

    if (newEntries.length === 0) {
        console.log("No new image found")
        return
    }

    const final = [...existing, ...newEntries]
    await fs.writeFile(outFile, JSON.stringify(final, null, 2))
    console.log(`Append ${newEntries.length} new images`)
    console.log(`Gallery meta updated, total ${final.length} images`)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})