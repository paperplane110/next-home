import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import Tree from "./components/tree";

const data = [
  {
    id: 1,
    name: "Node 1",
  },
  {
    id: 2,
    name: "Node 2",
    children: [
      {
        id: 3,
        name: "Child Node 3",
        children: [
          {
            id: 5,
            name: "Greatchild Node 5",
            children: [
              {
                id: 6,
                name: "GGchild Node 6",
              },
            ]
          },
        ]
      },
      {
        id: 4,
        name: "Child Node 4",
      },
    ],
  },
  {
    id: 7,
    name: "Node 7",
  },
  {
    id: 8,
    name: "Node 8",
  },
  {
    id: 9,
    name: "Node 9",
  },
  {
    id: 10,
    name: "Node 10",
  },
  {
    id: 11,
    name: "Node 11",
  },
  {
    id: 12,
    name: "Node 12",
  },
  {
    id: 13,
    name: "Node 13",
  }
]

export default async function TreePage({ children }: { children: React.ReactNode }) {

  return (
    <div className="section page-top-margin">
      <div className="subsection">
        <h1 className="headline font-serif font-light soft-70">
          Node Tree Component
        </h1>
      </div>
      <div className="subsection mt-16 text-muted-foreground">
        节点树/侧边栏布局
        <ul className="mt-2">
          <li>点击节点后，跳转到该节点的路由，支持节点详情页（动态路由）</li>
          <li>节点树位于侧边栏，侧边栏宽度支持左右变动</li>
        </ul>
      </div>
      {/* 若使用 ResizablePanelGroup，direction 之外的方向需要明确定义，否则 shrink */}
      <div className="h-[400px] mt-16">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-w-sm sm:min-w-md md:min-w-3xl lg:min-w-5xl border border-black"
        >
          {/* 
            min-w-[10rem] 用来配置侧边栏最小宽度
            flex flex-col 用来配置侧边栏内容垂直排列，为的是：内容超出时显示滚动条，
              配合下面的 overflow-y-scroll
          */}
          <ResizablePanel
            defaultSize={10}
            className="min-w-40 max-w-[20rem] flex flex-col"
          >
            <h1 className="border-b">Tree Page</h1>
            <div className="overflow-y-scroll">
              {data ? <Tree nodeList={data} /> : <Tree.Skeleton />}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={70}>
            <div className="border-b">Navigation</div>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}