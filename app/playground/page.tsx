import Link from "next/link"

export default function Playground() {
  const routeList = [
    {
      name: "Node tree",
      path: "/tree",
    },
    {
      name: "fonts",
      path: "/fonts",
    },
    {
      name: "typography",
      path: "/typography",
    },
    {
      name: "book component",
      path: "/book-component",
    },
    {
      name: "Colorful drop shadow effect on text",
      path: "/colorful-drop-shadow-effect-on-text",
    },
    {
      name: "album",
      path: "/album",
    },
    {
      name: "Folder component",
      path: "/folder-component",
    }
  ]
  return (
    <div className="section">
      <header className="page-top-margin subsection">
        <h1 className="headline font-serif font-light soft-70">Playground</h1>
      </header>
      <div className="subsection mt-16">
        {routeList.map((route) => (
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
  )
}