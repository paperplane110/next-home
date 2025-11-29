import { allPosts, allReadings } from "content-collections"
import Link from "next/link"
import YearProgress from "./components/year-progress"
import OuterLink from "@/components/link";
import { MusicPlayerCard } from "@/components/music-player-card";
import { Badge } from "@/components/ui/badge";
import { PostItem } from "@/components/post-item";

export default function Home() {
  const nowYear = new Date().getFullYear();

  return (
    <div className="section font-serif">
      <div className="subsection page-top-margin mb-12">
        {/* <p className="ml-1 text-muted-foreground">Tianyu&apos;s</p> */}
        <Badge variant="secondary" className="text-muted-foreground">Tianyu&apos;s</Badge>
        <h1 className="text-7xl font-light soft-60">Blog<span className="text-primary">.</span></h1>
        <h3 className="ml-1 text-xl italic font-light">{nowYear}</h3>
      </div>
      <div className="subsection mb-6">
        <section id="about">
          <p>
            Hi, I&apos;m Tianyu, a software engineer with a passion for building things.
          </p>
          <br />
          <p>
            I&apos;m currently based in Beijing and working at DiDi&apos;s Robotaxi team,
            where I&apos;m building the test platform and tools for our team.
            Learn about <OuterLink href="/about"><b>me</b></OuterLink> more, if you are interested.
          </p>
        </section>
      </div>

      <div className="subsection mb-12">
        <MusicPlayerCard />
      </div>

      <div className="subsection mb-12">
        <h2 className="text-muted-foreground font-sans text-sm">Today</h2>
        <div className="mt-4 flex items-center text-muted-foreground text-sm">
          {/* <div className="hidden sm:block sm:flex-2 font-sans text-sm opacity-0 sm:opacity-100">Today</div> */}
          <div className="flex-1 border-b border-dotted border-muted-foreground transform translate-y-px"></div>
          <YearProgress/>
          <div className="flex-1 border-b border-dotted border-muted-foreground transform translate-y-px"/>
          {/* <div className="flex-0 sm:flex-2"/> */}
        </div>
        <p className="mt-2">
          今天是北京的秋天，金色的太阳，金色的银杏叶，秋风微冷，吹散了昏沉的思绪
        </p>
      </div>

      <div className="subsection mb-12">
        <h2 className="text-muted-foreground font-sans text-sm">Writing</h2>
        <div className="mt-4 grid grid-cols-1 gap-y-1">
          {allPosts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map((post, index) => (
              <PostItem key={index} post={post} />
            ))}
          {allPosts.length > 4 && (
            <Link href="/posts">
              <div className="group/more mt-1 flex justify-between items-center">
                <div className="flex-1 border-b border-muted-foreground border-dotted" />
                <div className="font-mono text-xs text-muted-foreground group-hover/more:text-primary">
                  &gt;&gt;&gt; More posts
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="subsection mb-12">
        <h2 className="text-muted-foreground font-sans text-sm">Reading</h2>
        <div className="mt-4 grid grid-cols-1 gap-y-1">
          {allReadings
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map((post, index) => (
              <PostItem key={index} post={post} />
            ))}
          {allReadings.length > 4 && (
            <Link href="/reading">
              <div className="group/more mt-1 flex justify-between items-center">
                <div className="flex-1 border-b border-muted-foreground border-dotted" />
                <div className="font-mono text-xs text-muted-foreground group-hover/more:text-primary">
                  &gt;&gt;&gt; More book reviews
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* 
      <div className="subsection mb-8">
        <p>Besides, I have a lot out hobbies, including:
          reading, hiking, photography, games and music.</p>
        <br />
        <p>
          Recently, I&apos;m interested in ice staking, and just started learning about it.
        </p>
      </div> */}
    </div>
  )
}
