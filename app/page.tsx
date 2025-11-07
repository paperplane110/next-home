import { allPosts } from "content-collections"
import Link from "next/link"
import YearProgress from "./components/year-progress"
import OuterLink from "@/components/link";
import { MusicPlayerCard } from "@/components/music-player-card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const nowDate = new Date().toDateString().split(" ").slice(1, 3).join(", ");
  const nowYear = new Date().getFullYear();
  // console.log(allPosts[0])

  return (
    <div className="section font-serif">
      <div className="subsection page-top-margin mb-12">
        {/* <p className="ml-1 text-muted-foreground">Tianyu&apos;s</p> */}
        <Badge variant="secondary" className="text-muted-foreground">Tianyu&apos;s</Badge>
        <h1 className="text-7xl font-light soft-60">Blog<span className="text-pink-600">.</span></h1>
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

      <div className="subsection mb-8">
        <MusicPlayerCard />
      </div>

      <div className="subsection mb-8">
        <div className="grid grid-cols-2">
          <div id="writing">
            <OuterLink href="/posts">
              <span className="font-bold">Writing</span>
            </OuterLink>
            <div>
              <ul>
                {allPosts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 4)
                  .map((post) => (
                    <li key={post._meta.path} className="mt-1 text-muted-foreground hover:text-black">
                      {/* <span className="block size-1 bg-pink-600 rounded-full mr-2" /> */}
                      <h3>
                        <Link href={`/posts/${post._meta.path}`}>{post.title}</Link>
                      </h3>
                    </li>
                  ))}
                {allPosts.length > 4 && (
                  <li className="mt-3">
                    More posts……
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div id="projects">
            <h3 className="">Projects</h3>
          </div>
        </div>
      </div>

      <div className="subsection mb-8">
        <p>
          <span className="font-bold">Today</span>
          &nbsp;is {nowDate}. Time flies so quickly. I&apos;m still trying to catch the moment.
        </p>
        <div className="flex justify-center p-4">
          <YearProgress />
        </div>
      </div>

      <div className="subsection mb-8">
        <p>Besides, I have a lot out hobbies, including:
          reading, hiking, photography, games and music.</p>
        <br />
        <p>
          Recently, I&apos;m interested in ice staking, and just started learning about it.
        </p>
      </div>
    </div>
  )
}
