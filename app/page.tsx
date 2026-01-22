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
    <div className="section">
      <div className="subsection page-top-margin mb-12">
        <Badge variant="secondary" className="text-muted-foreground">Tianyu&apos;s</Badge>
        <h1 className="text-7xl font-serif font-light soft-60">Blog<span className="text-primary">.</span></h1>
        <h3 className="ml-1 text-xl italic font-serif font-light">{nowYear}</h3>
      </div>
      <div className="subsection mb-12 text-muted-foreground leading-6">
        <section id="about">
          <p>
            Hi, I&apos;m <span className="text-black font-semibold">Tianyu</span>, a software engineer with a passion for building things.
            I&apos;m currently based in Beijing and moved on from my role at <span className="text-black font-semibold">DiDi&apos;s Robotaxi</span> team.
            Learn more about <OuterLink className="hover:underline" href="/about">me</OuterLink>, if you are interested.
          </p>
          {/* <br />
          <p>
            I&apos;m currently based in Beijing and moved on from my role at <span className="text-black font-semibold">DiDi&apos;s Robotaxi team</span>,
            where I built the test platform and tools for HiL benches.
            Learn about <OuterLink className="hover:underline" href="/about">me</OuterLink> more, if you are interested.
          </p> */}
        </section>
      </div>

      <div className="subsection mb-12 font-serif">
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
        <p className="mt-2 font-serif">
          今天是北京的冬日，周围都是顶着寒风、脚步匆匆为生活奔波的人们
        </p>
      </div>

      <div className="subsection mb-12">
        <h2 className="text-muted-foreground font-sans text-sm">Writing</h2>
        <div className="mt-4 font-serif grid grid-cols-1 gap-y-0.5">
          {allPosts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map((post, index) => (
              <PostItem key={index} leadingURL="/posts" post={post} />
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
        <div className="mt-4 grid grid-cols-1 gap-y-0.5 font-serif">
          {allReadings
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map((post, index) => (
              <PostItem key={index} leadingURL="/reading" post={post} />
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
