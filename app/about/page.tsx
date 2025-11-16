import { WorkExperience } from "@/components/work-experience";


export default function AboutPage() {
  const career = [
    {
      company: "Baidu - Apollo, Ltd.",
      logo: "icon-[cib--baidu]",
      isCurrent: false,
      positions: [
        {
          title: "测试开发工程师 - HiL 方向",
          start: "2022.11",
          end: "2024.12",
          type: "Fulltime",
          content: [
            {
              type: "text",
              text: ["Responsibilities:"],
            },
            {
              type: "bullet",
              text: [
                "Developed and maintained L2 and L3 testing toolchains.",
                "Led the development of the HiL testing platform for L3 projects.",
                "Provided technical support for QA group, including CI, pipeline management, and automotive software code scanning (Parasoft)."
              ],
            }
          ],
          skills: ["Protobuf", "Cybertron", "Docker", "FastAPI", "Nuxt"]
        }
      ]
    }
  ];

  return (
    <div className="section page-top-margin">
      <header className="subsection">
        <h1 className="headline soft-70 font-serif font-light">About</h1>
      </header>
      <div className="subsection pt-8">
        {career.map((careerItem, index) => (
          <WorkExperience key={index} career={careerItem} />
        ))}
      </div>
    </div>
  );
}