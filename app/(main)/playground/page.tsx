import Link from "next/link"

export default function Playground() {
  const themeList = [
    {
      theme: "Fundamentals",
      routeList: [
        {
          name: "Sidebar Tree (Dynamic Routes)",
          path: "/sidebar-tree",
          tags: ["framework"]
        },
        {
          name: "Everything About Forms",
          path: "/everything-about-forms",
          tags: ["form"]
        },
      ]
    },
    {
      theme: "Design & Reverse Engineering",
      routeList: [
        {
          name: "Book Component",
          path: "/book-component",
          tags: ["css-3d"]
        },
        {
          name: "Colorful Drop Shadow Effect on Text",
          path: "/colorful-drop-shadow-effect-on-text",
          tags: ["css-scroll"]
        },
        {
          name: "Album",
          path: "/album",
          tags: ["layout"]
        },
        {
          name: "Folder Component",
          path: "/folder-component",
          tags: ["css-transition"]
        },
        {
          name: "Glossy Icon",
          path: "/glossy-icon",
          tags: ["css"]
        },
        {
          name: "Access Denied Card",
          path: "/access-denied",
        },
        {
          name: "Card Contraction/Expansion on Scroll",
          path: "/card-contraction-on-scroll",
        },
        {
          name: "Experiment with Layout Animation",
          path: "/image-expand-animation",
        },
        {
          name: "Artwork Label",
          path: "/artwork-label",
          tags: ["design"]
        },
      ]
    },
    {
      theme: "Learning",
      routeList: [
        {
          name: "Animations.dev",
          path: "/animations-dev",
        },
        {
          name: "Family Tree",
          path: "/family-tree",
          tags: ["react-flow", "graph"]
        },
      ]
    }
  ]
  return (
    <div className="section">
      <header className="page-top-margin subsection">
        <h1 className="headline font-serif font-light soft-70">Playground</h1>
      </header>
      <div className="subsection mt-16">
        {
          themeList.map((group) => (
            <div key={group.theme} className="mt-8">
              <h2 className="font-semibold text-xl">{group.theme}</h2>
              <div className="mt-4">
                {group.routeList.map((route) => (
                  <div key={route.path} className="flex items-center">
                    <Link
                      href={`/playground${route.path}`}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {route.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
