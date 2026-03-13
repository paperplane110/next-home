"use client"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export default function ArtworkLabel() {
  const [withDescription, setWithDescription] = useState(true)

  const paintingInfo = {
    artist: "John Singer Sargent",
    from: "United States",
    birthDate: "1893",
    deathDate: "1970",
    title: "Carnation, Lily, Lily, Rose",
    createdTime: "1885-86",
    material: "Oil on canvas",
    description: "The children lighting lanterns are Dolly (left) and Polly (right) Barnard. Their father, illustrator Frederick Barnard, was friends with Sargent. It was painted in a garden in Broadway, a village in south west England where Sargent stayed in the summer of 1885." +
      "Sargent wanted to paint from real life. There were only a few minutes each evening where the light was right. He would place his easel and paints, pose the models beforehand, and wait for the right moment to start. As summer ended and the flowers died, he replaced them with pot plants."
  }
  return (
    <div className="page-top-margin sm:pb-8 section relative overflow-hidden">
      <div className="subsection">
        <h1 className="headline soft-70 font-serif font-light">Artwork Label</h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          Variations of the painting label.
        </p>
      </div>
      <div id="painting-label" className="subsection mt-16">
        <h2 className="font-bold text-2xl">Painting Label</h2>
        <p className="mt-8 space-y-6 [&>p+ol]:-mt-4 text-base text-muted-foreground">
          Label for painting, in English, one column, short version&nbsp;
          <button
            className="font-medium underline cursor-pointer"
            onClick={() => setWithDescription(!withDescription)}>{withDescription ? "with" : "without"} description</button>.
        </p>
        <div className="mt-8 border p-8">
          <div className="font-medium text-xl">{paintingInfo.artist}</div>
          <div className="text-sm">{paintingInfo.from},&nbsp;
            {paintingInfo.deathDate ? (
              <span>
                {paintingInfo.birthDate}-{paintingInfo.deathDate}
              </span>
            ) : (
              <span>
                born {paintingInfo.birthDate}
              </span>
            )}
          </div>

          <div className="mt-4 text-3xl font-semibold"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >{paintingInfo.title}</div>
          <div className="text-sm">{paintingInfo.createdTime}</div>

          <div className="my-4 text-sm">{paintingInfo.material}</div>
          <AnimatePresence>
            {withDescription && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-[75%] text-lg leading-snug"
                style={{
                  fontFamily: "var(--font-crimson-pro)",
                }}
              >{paintingInfo.description}</motion.div>
            )}
          </AnimatePresence>
        </div>
        <hr className="my-16" />
      </div>
    </div>

  )
}