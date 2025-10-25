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
            name: "Grandchild Node 5",
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
    <div className="min-h-screen grid place-content-center">
      {/* 若使用 ResizablePanelGroup，direction 之外的方向需要明确定义，否则 shrink */}
      <div className="h-[400px]">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-w-5xl border"
        >
          {/* 
            min-w-[10rem] 用来配置侧边栏最小宽度
            flex flex-col 用来配置侧边栏内容垂直排列，为的是：内容超出时显示滚动条，
              配合下面的 overflow-y-scroll
          */}
          <ResizablePanel
            defaultSize={10}
            className="min-w-[10rem] max-w-[20rem] flex flex-col"
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