import Image from "next/image";

type AlbumProps = {
  className?: string;
  albumTitle: string;
  albumCover: string;
  labelIcon: string;
  labelSize?: number;
  artist: string;
  releaseDate: string;
  genre: string[];
  songs: string[];
  bgColor: string;
}

export default function AlbumPage({
  className, albumTitle, albumCover, labelIcon, labelSize = 20, artist, releaseDate, genre, songs, bgColor
}: AlbumProps) {
  return (
    <div className={`grid sm:grid-cols-2 sm:gap-8 ${className}`}>
      <div style={{ backgroundColor: bgColor }}>
        <Image src={albumCover} alt={artist} width={500} height={500} />
        <div className="h-42 flex justify-between items-end px-3 py-3 text-sm">
          <Image src={labelIcon} alt={artist} width={labelSize} height={labelSize} />
          <div className="flex flex-col text-right">
            <p className="font-bold text-black/55">{artist}</p>
            <p className="text-black/30">{releaseDate}</p>
          </div>
        </div>
      </div>
      <div className="px-3 py-3 flex flex-col gap-y-12 justify-between" style={{ backgroundColor: bgColor }}>
        <div>
          <h2 className="text-5xl font-bold text-black/55">{albumTitle}</h2>
          <p className="mt-4 text-sm text-black/30">{genre.join(" · ")}</p>
        </div>
        <div className="text-sm text-black/30">
          {songs.join(" · ")}
        </div>
      </div>
    </div>
  );
}