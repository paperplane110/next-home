"use client"
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useClickInsideOutside } from "@/hooks/use-click-inside-outside";
import { XIcon } from "lucide-react";

export default function SectionFramerAdvanced() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Advanced Animations</h2>
        </div>
      </div>
      <div className="cp">
        <p>在上一节中，我们介绍了 <code>Motion</code> 动画的基本用法。
          这一节，我们将介绍一些更高级的动画用法。
        </p>
      </div>
      <h3 className="mt-8 ch3">
        Shared Layout Homework: iOS store
      </h3>
      <SharedLayoutHomework />
      <h3 className="mt-8 ch3">
        Gestures
      </h3>
      <GragExample />
      <h3 className="mt-8 ch3">
        Homework: App Store-like Transition
      </h3>
      <AppStoreLikeTransition />
      {/* <h3 className="mt-8 ch3">
        Debug
      </h3>
      <CardPrototype /> */}
    </div>
  )
}


function SharedLayoutHomework() {
  const GAMES = [
    {
      title: "The Oddysey",
      description: "Explore unknown galaxies.",
      longDescription:
        "Throughout their journey, players will encounter diverse alien races, each with their own unique cultures and technologies. Engage in thrilling space combat, negotiate complex diplomatic relations, and make critical decisions that affect the balance of power in the galaxy.",
      image:
        "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/space.png",
    },
    {
      title: "Angry Rabbits",
      description: "They are coming for you.",
      longDescription:
        "The rabbits are angry and they are coming for you. You have to defend yourself with your carrot gun. The game is not simple, you have to be fast and accurate to survive.",
      image:
        "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/rabbit.png",
    },
    {
      title: "Ghost town",
      description: "Find the ghosts.",
      longDescription:
        "You are in a ghost town and you have to find the ghosts. But be careful, they are dangerous.",
      image:
        "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/ghost.webp",
    },
    {
      title: "Pirates in the jungle",
      description: "Find the treasure.",
      longDescription:
        "You are a pirate and you have to find the treasure in the jungle. But be careful, there are traps and wild animals.",
      image:
        "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/pirate.png",
    },

    {
      title: "Lost in the mountains",
      description: "Find your way home.",
      longDescription:
        "You are lost in the mountains and you have to find your way home. But be careful, there are dangerous animals and you can get lost.",
      image:
        "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/boy.webp",
    },
  ];
  const [activeGame, setActiveGame] = useState<typeof GAMES[0] | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useClickInsideOutside(cardRef, () => { }, () => setActiveGame(null));
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveGame(null);
      }
    }
    addEventListener("keydown", onKeyDown);
    return () => {
      removeEventListener("keydown", onKeyDown);
    }
  })
  return (
    <div>
      <div className="cp">
        <p>
          这是一个 iOS store 的共享布局动画。
        </p>
      </div>
      <div className="csc mt-8 relative overflow-hidden">
        <>
          <AnimatePresence>
            {
              activeGame && (
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-black/15"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )
            }
          </AnimatePresence>
          <AnimatePresence>
            {
              activeGame && (
                <div
                  className="absolute inset-0 grid place-items-center z-10"
                  onClick={() => setActiveGame(null)}
                >
                  <motion.div
                    ref={cardRef}
                    layoutId={`card-${activeGame.title}`}
                    className="bg-background p-4 w-[90%] sm:w-[500px]"
                    style={{ borderRadius: 12 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-4">
                      <motion.img layoutId={`image-${activeGame.title}`} src={activeGame.image} alt={activeGame.title} className="size-14" style={{ borderRadius: 12 }} />
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <motion.h4 layoutId={`title-${activeGame.title}`} className="font-semibold text-sm">{activeGame.title}</motion.h4>
                          <motion.p layoutId={`description-${activeGame.title}`} className="text-sm text-muted-foreground">{activeGame.description}</motion.p>
                        </div>
                        <motion.button layoutId={`button-${activeGame.title}`} className="px-3 py-1 bg-accent rounded-full text-xs text-blue-400 font-bold">Get</motion.button>
                      </div>
                    </div>
                    <motion.p
                      className="mt-4 text-sm text-[#63635d]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.05 } }}
                    >
                      {activeGame.longDescription}
                    </motion.p>
                  </motion.div>
                </div>
              )
            }
          </AnimatePresence>
        </>
        <ul className="w-full flex flex-col">
          {GAMES.map((game) => (
            <motion.li
              layoutId={`card-${game.title}`}
              key={game.title}
              className="mb-4 list-none flex gap-4 cursor-pointer"
              onClick={() => setActiveGame(game)}
            >
              <motion.img layoutId={`image-${game.title}`} src={game.image} alt={game.title} className="size-14" style={{ borderRadius: 12 }} />
              <div className="flex justify-between items-center w-full border-b border-b-accent">
                <div>
                  <motion.h4 layoutId={`title-${game.title}`} className="font-semibold text-sm">{game.title}</motion.h4>
                  <motion.p layoutId={`description-${game.title}`} className="text-sm text-muted-foreground">{game.description}</motion.p>
                </div>
                <motion.button layoutId={`button-${game.title}`} className="px-3 py-1 bg-accent rounded-full text-xs text-blue-400 font-bold">Get</motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="cp">
        <p>注意，<span className="font-bold text-black">变化前后每个相关联的元素，都需要添加对应的 layoutId 进行关联</span>，比如卡片整体、图片、标题、描述、蓝色按钮等，这样才能避免元素在变化过程中发生奇怪的形变。</p>
        <p>还有一个细节就是，对于详情的长段描述，在退出时，为其专门设置一个很短的退出过渡时间，让它先消失，然后是卡片整体的退出过渡。</p>
      </div>
    </div>
  )
}

function GragExample() {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div className="cp">
      <p>
        这是一个简单的拖动示例。
      </p>
      <div
        ref={containerRef}
        className="csc mt-8"
      >
        <motion.div
          drag
          dragConstraints={containerRef}
          className="relative w-16 h-16 bg-green-100 border-2 border-green-400 rounded-full cursor-grab active:cursor-grabbing"
          whileDrag={{
            scale: 1.1,
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <div className="absolute -top-6 text-sm">
            {!isDragging ? "Drag me" : "Woohoo!"}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function AppStoreLikeTransition() {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  useClickInsideOutside(cardRef, () => { }, () => setIsOpen(false));
  return (
    <>
      <div className="cp">
        <p>
          这是一个简单的 App Store 风格的过渡动画示例。但是存在 <span className="font-bold text-primary">未解决的 Bug</span>：
        </p>
        <ol>
          <li><span className="line-through">卡片大标题在变幻时存在闪烁形变</span>: <span className="font-bold text-black">已解决</span>，给变换前后的标题元素 <code>motion.h2</code> 添加 <code>layout=&quot;position&quot;</code> 即可</li>
          <li>卡片底部半透明部分，在变形时会有延迟，底部露出灰色部分</li>
        </ol>
      </div>
      <div className="csc mt-8 h-[800px] relative">

        <motion.div
          layoutId="album"
          className="relative w-[300px] h-[300px] flex flex-col justify-end overflow-hidden" style={{ borderRadius: 18 }}
          onClick={() => setIsOpen(true)}
        >
          <motion.img
            layoutId="album-image"
            src="/music/the-dreamer.jpg"
            className="absolute inset-0 w-full h-full"
          />
          <motion.button
            layoutId="close-button"
            className="absolute top-4 right-4 bg-black/30 size-8 rounded-full flex justify-center items-center"
            style={{ opacity: 0 }}
          >
            <XIcon className="size-5 text-white" />
          </motion.button>
          <div className="flex flex-col gap-4">
            <motion.h1 
              layout="position"
              layoutId="album-title" className="z-1 text-white text-4xl font-black pl-4">
              The<br />Dreamer
            </motion.h1>
            <motion.div layoutId="album-info" className=" flex py-3 justify-between items-center w-full px-4 bg-black/30 filter backdrop-blur-xs overflow-hidden" style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
              <motion.div layoutId="album-info-content">
                <motion.h2 layoutId="album-subtitle" className="text-white text-sm font-bold">
                  梦想家 / 方大同
                </motion.h2>
                <motion.p layoutId="album-date" className="text-gray-200 text-xs">
                  2024-10-8
                </motion.p>
              </motion.div>
              <motion.button layoutId="detail-button" className="px-4 py-2 bg-accent/30 rounded-full text-sm text-white font-bold">Detail</motion.button>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {
            isOpen && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div className="z-1 flex flex-col w-[400px]"

                  ref={cardRef}
                  layoutId="album"
                >
                  <motion.div
                    className="relative w-[400px] h-[400px] flex flex-col justify-end overflow-hidden" style={{ borderRadius: 0 }}>
                    <motion.img
                      layoutId="album-image"
                      src="/music/the-dreamer.jpg"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <motion.button
                      layoutId="close-button"
                      className="absolute top-4 right-4 bg-black/30 size-8 rounded-full flex justify-center items-center cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <XIcon className="size-5 text-white" />
                    </motion.button>
                    <div className="flex flex-col gap-4">
                      <motion.h1 
                        layout="position"
                        layoutId="album-title"  
                        className="z-1 text-white text-4xl font-black" 
                        style={{ paddingLeft: 16}}
                      >
                        The<br />Dreamer
                      </motion.h1>
                      <motion.div layoutId="album-info" className="flex py-3 justify-between items-center w-full px-4 bg-black/30 filter backdrop-blur-xs overflow-hidden" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                        <motion.div layoutId="album-info-content">
                          <motion.h2 layoutId="album-subtitle" className="text-white text-sm font-bold">
                            梦想家 / 方大同
                          </motion.h2>
                          <motion.p layoutId="album-date" className="text-gray-200 text-xs">
                            2024-10-8
                          </motion.p>
                        </motion.div>
                        <motion.button layoutId="detail-button" className="px-4 py-2 bg-accent/30 rounded-full text-sm text-white font-bold">Detail</motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-white px-4 py-6 flex flex-col gap-6 text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <p>
                      <span className="font-bold text-black">时隔九年的回归之作</span>&nbsp;距离方大同发布双碟专辑《JTW》转眼九年，该专辑为他赢得了2017年备受瞩目的金曲年度最佳男歌手奖。自此之后，他便将注意力转向了幕后的创意项目。
                      最近的几年由于身体有恙而足不出户，目前虽然身体仍然在康复阶段中，方大同决定在这段时间携最新专辑 <span className="font-bold text-black">《梦想家 The Dreamer》</span>回归。
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            )
          }
        </AnimatePresence>
      </div>
    </>
  )
}

function CardPrototype() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="csc relative justify-center" onClick={() => setIsOpen(!isOpen)}>
        <motion.div layoutId="box" className="relative flex items-start size-[300px] bg-amber-100">
          <motion.h2 layoutId="box-title-1" className="block text-sm">Title</motion.h2>
        </motion.div>
        <AnimatePresence>
          {
            isOpen ? (
                <motion.div layoutId="box" className="absolute size-[80%] bg-amber-100">
                  <motion.h2 layoutId="box-title-1" className="absolute text-sm">Title</motion.h2>
                </motion.div>
            ) : null
          }
        </AnimatePresence>
      </div>
  )
}
