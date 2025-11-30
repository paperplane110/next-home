import Image from "next/image";
import Album from "@/app/playground/album/components/album";

export default function AlbumPage() {
  const albumTitle = "Racing Mount Pleasant";
  const albumCover = "/music/racing-mount-pleasant.jpg";
  const labelIcon = "/label-icon/RR-logo.svg";
  const artist = "Racing Mount Pleasant";
  const releaseDate = "15 August 2025";
  const genre = ["Folk rock", "Post-rock", "Midwest emo", "Baroque pop"];
  const songs = [
    "Your New Place",
    "Tenspeed (Shallows)",
    "Heavy Red",
    "Emily",
    "Seminary",
    "You",
    "You Pt. 2",
    "Racing Mount Pleasant",
    "Call It Easy",
    "Outlast",
    "34th Floor",
    "Seyburn",
    "Your Old Place",
  ]
  const bgColor = "#f1f0ee";

  const duetsSongList = [
    "Time to Say Goodbye (Con te partirò)",
    "The Prayer",
    "Perfect Symphony",
    "Fall on Me",
    "Vivo por ella",
    "E più ti penso",
    "Somos Novios (It's Impossible)",
    "Quizás, Quizás, Quizás",
    "Dare to Live (Vivere)",
    "Da Stanotte in Poi (From This Moment On)",
    "Hallelujah",
    "If Only",
    "Canzoni stonate",
    "Return to Love",
    "La vie en rose",
    "Notte 'e piscatore",
    "Holding On",
    "Can't Help Falling In Love",
    "Il Mare Calmo Della Sera",
    "Rimani Qui",
    "Moon River",
    "Canto della Terra",
    "La Voce del Silenzio",
    "Amazing Grace",
    "Un Amore Così Grande",
    "Pianissimo",
    "What Child Is This"
  ]
  // 共同的土地歌曲列表
  const motherlandSongList = [
    "Meadow",
    "回环的梦境",
    "Leave Now, Breathe Now",
    "家的故事",
    "松林",
    "余烬",
    "溪水",
    "停滞的冬夜",
    "朋友",
    "Struggler",
    "平原",
    "明天天气如何"
  ]
  const noteSongList = [
    "白い泥", "土砂降り", "永遠はきらい", "From The Seeds", "あくび", "スターチス", 
    "夜明けをくちずさめたら（note ver.）", "ハッピーエンド",
    "Little Birds", "一縷"
  ]
  return (
    <div className="section page-top-margin">
      <div className="subsection">
        <h1 className="headline soft-70 font-serif font-light">Album</h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          An Album component inspired by &quot;Racing Mount Pleasant&quot;
        </p>
      </div>
      <div className="mt-16 subsection">
        <h2 className="font-bold">Album with light background color</h2>
        <Album
          className="mt-8"
          albumTitle={albumTitle}
          albumCover={albumCover}
          labelIcon={labelIcon}
          artist={artist}
          releaseDate={releaseDate}
          genre={genre}
          songs={songs}
          bgColor={bgColor}
        />
      </div>
      <div className="mt-16 subsection">
        <h2 className="font-bold">Album with dark background color</h2>
        <div className="mt-8 grid sm:grid-cols-2 sm:gap-8">
          <div className="bg-[#190f1d]">
            <Image src="/music/duets.jpeg" alt="Andrea Bocelli" width={500} height={500} />
            <div className="h-42 flex justify-between items-end px-3 py-3 text-sm">
              <Image className="filter invert-70" src="/label-icon/Decca_Records.png" alt="Decca Records" width={40} height={40} />
              <div className="flex flex-col text-right">
                <p className="font-bold text-white/70">Andrea Bocelli</p>
                <p className="text-white/70">25 Oct 2023</p>
              </div>
            </div>
          </div>
          <div className="px-3 py-3 flex flex-col justify-between gap-y-12 bg-linear-to-t sm:bg-linear-to-bl from-[#462a52] to-[#190f1d]">
            <div>
              <h2 className="text-6xl font-serif font-thin soft-70 text-white/70">Duets</h2>
              <p className="mt-4 text-sm font-serif text-white/70">&nbsp;&nbsp;30th Anniversary Edition</p>
            </div>
            <div className="text-[10px] text-white/30">
              {duetsSongList.join(" · ")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 subsection">
        <h2 className="font-bold">浅色背景的中文专辑</h2>
        <div className="mt-8 grid sm:grid-cols-2 sm:gap-8">
          <div className="bg-[#efefef]">
            <Image src="/music/motherland.jpg" alt="共同的土地" width={500} height={500} />
            <div className="h-42 flex justify-between items-end px-3 py-3 text-sm">
              {/* <Image className="filter opacity-15" src="/label-icon/SJR.png" alt="SJR" width={30} height={30} /> */}
              <div className="w-6 h-6 flex items-center justify-center border rounded-full border-black/70 text-black/70 text-[10px] font-bold">
                SJR
              </div>
              <div className="flex flex-col text-right">
                <p className="font-bold font-serif text-black/70">缺省 · Default</p>
                <p className="font-serif font-semibold text-black/40">二〇二三 九月 二十一日</p>
              </div>
            </div>
          </div>
          <div className="px-3 py-3 flex flex-col gap-y-12 justify-between bg-linear-to-t sm:bg-linear-to-bl from-[#f6f6f6] to-[#efefef] font-serif">
            <div>
              <h2 className="text-6xl font-thin soft-70 text-black/70">共同的<br/>土地</h2>
              <p className="mt-4 text-sm text-black/40">摇滚 · 乡村 · 民谣</p>
            </div>
            <div className="text-[11px] text-black/40">
              {motherlandSongList.join(" · ")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 subsection">
        <h2 className="font-bold">彩色背景的日语专辑</h2>
        <div className="mt-8 grid sm:grid-cols-2 sm:gap-8">
          <div>
            <Image src="/music/note.jpg" alt="共同的土地" width={500} height={500} />
            <div className="h-42 flex justify-between items-end px-3 py-3 text-sm">
              <Image className="filter contrast-200" src="/label-icon/polydor.png" alt="Polydor" width={40} height={40} />
              <div className="flex flex-col text-right">
                <p className="font-bold font-serif text-black/70">上白石萌音</p>
                <p className="font-serif font-semibold text-black/40">二〇二〇 八月 二十六日</p>
              </div>
            </div>
          </div>
          <div className="px-3 py-3 flex flex-col gap-y-12 justify-between font-serif bg-linear-to-t sm:bg-linear-to-bl from-lime-300/20 to-lime-100/0">
            <div>
              <h2 className="text-6xl font-light soft-70 text-lime-800">note</h2>
              <p className="mt-4 text-sm text-black/40">JPop · Anime · Movie</p>
            </div>
            <div className="text-xs text-black/40">
              {noteSongList.join(" · ")}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}