import Building from "@/components/building";
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
              type: "bullet",
              text: [
                "Leading a four people group, developing a data management system, managing 20M+ of images’ data and hundreds of benchmarks",
                "Cooperating with R&D, pass BCTC face anti-spoofing certification.",
                "Optimized the face recognition test tools with Faiss, shortening test time nearly 4x."
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
        <Building />
      </div>
      <div className="subsection pt-8">
        <h2 className="text-base font-bold">Work Experience</h2>
        <hr className="my-4" />
        {career.map((careerItem, index) => (
          <WorkExperience key={index} career={careerItem} />
        ))}
      </div>
      <div className="subsection pt-8">
        <h2 className="text-base font-bold">Education</h2>
        <hr className="my-4" />
        <Building />
      </div>
    </div>
  );
}