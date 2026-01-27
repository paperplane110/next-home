import Building from "@/components/building";
import OuterLink from "@/components/link";
import { type WorkExperienceProps, WorkExperience } from "@/components/work-experience";


export default function AboutPage() {
  const career: WorkExperienceProps[] = [
    {
      company: "DiDi - Voyager (Robotaxi), Ltd.",
      logo: "/didi.svg",
      isCurrent: false,
      positions: [
        {
          title: "Software Engineer in Test - HiL",
          icon: "icon-[lucide--workflow]",
          start: "2024.12",
          end: "2025.07",
          type: "Fulltime",
          content: [
            {
              type: "h3",
              text: ["Responsibilities:"],
            },
            {
              type: "bullet",
              text: [
                "Developed and debugged Hardware-in-the-Loop test benches",
                "Responsible for the test automation of the entire group",
              ],
            },
            {
              type: "h3",
              text: ["Key Achievements:"],
            },
            {
              type: "bullet",
              text: [
                "Built a full-stack service for manager several HiL test benches",
                "Created a CLI utility to simplify complex test rig procedures, enhancing overall team productivity.",
                "Maintained the testing pipeline, ensuring smooth and efficient test execution."
              ]
            }
          ],
          skills: ["Jenkins", "Pytest", "FastAPI", "Nextjs", "React", "shadcn-ui", "TailwindCSS"]
        }
      ]
    },
    {
      company: "Baidu - Apollo, Ltd.",
      logo: "icon-[cib--baidu]",
      isCurrent: false,
      positions: [
        {
          isCollapsed: true,
          title: "Software Engineer in Test - HiL",
          start: "2022.11",
          end: "2024.12",
          type: "Fulltime",
          content: [
            {
              type: "h3",
              text: ["Responsibilities:"],
            },
            {
              type: "bullet",
              text: [
                "Developed and maintained L2 and L3 testing toolchains.",
                "Led the development of the HiL testing platform for L3 projects.",
                "Provided technical support for QA group, including CI, pipeline management, and automotive software code scanning (Parasoft)."
              ],
            },
            {
              type: "h3",
              text: ["Key Achievements:"],
            },
            {
              type: "bullet",
              text: [
                "Built a full-stack service for the HiL testing platform",
                "Developed a testing tool based on CyberRT and Protobuf that can modify vehicle’s records, generating over 2,700 test cases through this tool.",
                "Maintained the testing pipeline within the team, managed Docker images, and proficiently utilized Docker."
              ]
            }
          ],
          skills: ["Protobuf", "Cybertron", "CAN/FlexRay", "Python", "Docker", "FastAPI", "Nuxt"]
        }
      ]
    },
    {
      company: "Aibee, Ltd.",
      logo: "🐝",
      isCurrent: false,
      positions: [
        {
          title: "Software Engineer in Test - CV Model",
          icon: "icon-[lucide--scan-eye]",
          start: "2021.04",
          end: "2022.10",
          type: "Fulltime",
          isCollapsed: true,
          content: [
            {
              type: "h3",
              text: ["Responsibilities:"],
            },
            {
              type: "bullet",
              text: [
                "Responsible for 5+ models’ testing and giving test reports with bad-case analysis and data visualization",
                "Liaises with algorithm researchers and improve the performance of models.",
                "Design, write and debugged dev-tools to accelerate model test procedures"
              ],
            },
            {
              type: "h3",
              text: ["Key Achievements:"],
            },
            {
              type: "markdown",
              text: [
                "- Leading a four people group, developing a data management system, managing 20M+ of images’ data and hundreds of benchmarks",
                "- Cooperating with R&D, pass [BCTC face anti-spoofing certification](https://www.bctest.com/content/32.html).",
                "- Optimized the face recognition test tools with [Faiss](https://engineering.fb.com/2017/03/29/data-infrastructure/faiss-a-library-for-efficient-similarity-search/), shortening test time nearly 4x."
              ]
            }
          ],
          skills: ["Numba", "Plotly", "React", "MongoDB", "Express", "Vue"]
        },
        {
          title: "Software Engineer in Test - CV Model",
          icon: "icon-[lucide--hammer]",
          start: "2020.10",
          end: "2021.04",
          type: "Intern",
          isCollapsed: true,
          content: [
            {
              type: "h3",
              text: ["Responsibilities:"],
            },
            {
              type: "bullet",
              text: [
                "Developed image processing tools to preprocess images for model testing.",
                "Managed the test data, including collecting, labeling, and storing test images.",
                "Badcase analysis and help developers identify and fix model bugs."
              ],
            }
          ],
          skills: ["Python", "Bash", "Numpy", "Pandas", "Pillow", "OpenCV"]
        }
      ]
    },
    {
      company: "Education",
      logo: "🎓",
      isCurrent: false,
      positions: [
        {
          title: "M.sc Robotics | University of Bristol",
          icon: "/img/about/uob_coat.png",
          start: "2019.09",
          end: "2020.09",
          type: "Merit",
          isCollapsed: true,
          content: [
            {
              type: "markdown",
              text: [
                "- **University of Bristol** Master of Science in Robotics",
                "- Language Proficiency: ILETS 7, C1 English Level."
              ]
            }
          ],
          skills: ["Robotics", "CV", "Control Theory", "Intro to AI", "Virtual Product Design", "Intelligent Information System"]
        },
        {
          title: "B.Eng Vehicle Engineering | SCUT",
          icon: "/img/about/scut.png",
          start: "2015.09",
          end: "2019.07",
          type: "3.25/4",
          isCollapsed: true,
          content: [
            {
              type: "markdown",
              text: [
                "- **South China University of Technology (SCUT)** Bachelor of Engineering in Vehicle Engineering",
                "- Member of SCUT Racing Formula Student Team, aerodynamic kits group.",
                "- Member of the SCUT Philharmonic Orchestra, First Violin Section; additionally served as Librarian.",
                "- Language Proficiency: CET6 English Level."
              ]
            }
          ],
          skills: ["Mechanical Engineering", "Vehicle Dynamics", "Vibrant Analysis", "CET 6"]
        }
      ]
    }
  ];

  return (
    <div className="section page-top-margin">
      {/* <header className="subsection">
        <h1 className="headline soft-70 font-serif font-light">About</h1>
      </header> */}
      <div className="subsection pt-8">
        <h2 className="text-base font-bold">About Me</h2>
        <hr className="my-4" />
        <div className="text-sm text-muted-foreground space-y-6">
          <p>Hi, I&apos;m <span className="font-bold text-black">Tianyu</span></p>
          <p>
            I&apos;m a software engineer with a passion for building beautiful and interesting things.
            I recently moved on from my role at <span className="font-bold text-black">DiDi-Voyager (Robotaxi)</span>
            &nbsp;to fully immerse myself in <span className="font-bold text-black">Full-Stack development</span>——the area where my true passion lies.
          </p>
          <p>Outside of work, I love bringing ideas to life through side projects, such as <OuterLink className="hover:underline" href="https://focustimer.pages.dev/">Focus-timer</OuterLink> or <OuterLink className="hover:underline" href="https://github.com/paperplane110/next-home">this blog</OuterLink>.</p>
          <p>When I&apos;m not coding, 
            I&apos;m an avid <span className="font-bold text-black">reader</span>, a <span className="font-bold text-black">hiker</span>, a <span className="font-bold text-black">gamer</span>, and a <span className="font-bold text-black">music lover</span>. 
            I&apos;m always open to interesting conversations and collaborations.
          </p>
          <p>Feel free to reach out via email at 
            &nbsp;<OuterLink className="hover:underline" href="mailto:jyuan7155@gmail.com">jyuan7155@gmail.com</OuterLink> or 
            find me on <OuterLink className="hover:underline" href="https://github.com/paperplane110">GitHub</OuterLink>.
          </p>
        </div>
      </div>
      <div className="subsection pt-8">
        <h2 className="text-base font-bold">Experience</h2>
        <hr className="my-4" />
        {career.map((careerItem, index) => (
          <WorkExperience key={index} career={careerItem} />
        ))}
      </div>
      <div className="subsection pt-8">
        <h2 className="text-base font-bold">Side Project</h2>
        <hr className="my-4" />
        <Building />
      </div>
    </div>
  );
}