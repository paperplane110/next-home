"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { TreeNode } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

function findParentIds(nodes: TreeNode[], targetId: number, path: Set<number> = new Set()): Set<number> {
  for (const node of nodes) {
    if (node.id === targetId) {
      return path
    }
    if (node.children?.length) {
      path.add(node.id)
      const result = findParentIds(node.children, targetId, path)
      if (result.size > 0) {
        return result
      }
      path.delete(node.id)
    }
  }
  return new Set()
}

type ExpandedState = Set<number>


interface TreeProps {
  nodeList: TreeNode[]
  level?: number
  expanded?: ExpandedState
  onExpandedChange?: (expanded: ExpandedState) => void
}

export default function Tree({
  nodeList,
  level = 0,
  expanded: externalExpanded,
  onExpandedChange: externalOnExpandedChange,
}: TreeProps) {
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>(new Set())

  const expanded = externalExpanded || internalExpanded
  const onExpandedChange = externalOnExpandedChange || setInternalExpanded

  const router = useRouter()
  
  // 检测路由变化，展开相应的节点
  const { nodeId } = useParams()
  useEffect(() => {
    if (nodeId) {
      const parentIds = findParentIds(nodeList, Number(nodeId))
      if (parentIds.size > 0) {
        const newExpanded = new Set(expanded)
        parentIds.forEach(id => newExpanded.add(id))
        onExpandedChange(newExpanded)
      }
    }
  }, [nodeId, nodeList])

  const toggleNode = (id: number) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    onExpandedChange(newExpanded)
  }

  const handleNodeClick = (id: number) => {
    router.push(`/playground/tree/${id}`) // 跳转到相应节点的路径
    toggleNode(id)                        // 展开或收起节点
  }

  return (
    // 明确定义 w-full，目的是使 truncate 生效
    <div className="w-full">
      {nodeList.map((node) => (
        <div 
          key={node.id} 
        >
          <Collapsible open={expanded.has(node.id)} onOpenChange={() => toggleNode(node.id)}>
            <div 
              style={{ "paddingLeft": `${level * 22}px` }}
              className="flex items-center relative"
            >
              {level ? Array.from({ length: level }).map((_, i) => (
                <div key={i} className={cn("absolute h-full bg-border", i % 2 === 0 ? "w-px" : "w-px opacity-0")} style={{ left: `${(i + 1) * 22 - 12}px` }} />
              )): null}
              {/* 这里让 icon 作为折叠的 trigger */}
              <CollapsibleTrigger asChild>
                <div className="p-0.5 grid rounded-sm place-items-center hover:bg-accent">
                  <span className={cn(
                    "w-4 h-4",
                    expanded.has(node.id)
                      ? "icon-[ph--folder-open-duotone]"
                      : "icon-[ph--folder-duotone]"
                  )} />
                </div>
              </CollapsibleTrigger>

              {/* 除了 icon 外都被放在这个 button 里，
                  这里又对 w-full 明确定义，
                  目的是使 truncate 生效
              */}
              <div
                role="button"
                className="w-full px-0.5 hover:bg-accent rounded-sm truncate"
                onClick={() => handleNodeClick(node.id)}
              >
                <div className="truncate">{node.name}-L{level}</div>
              </div>
              {/* 除 truncate 外的其他元素都需要明确定义宽度 */}
              <div className="w-6 h-6 rounded-sm grid place-items-center hover:bg-accent">
                <span className="icon-[ph--dot-outline-fill] w-6 h-6" />
              </div>
            </div>

            <CollapsibleContent>
              <div
                className="flex"
              >
                {node.children && node.children.length > 0 ? (
                  <Tree
                    nodeList={node.children}
                    level={level + 1}
                    expanded={expanded}
                    onExpandedChange={onExpandedChange}
                  />
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  )
}

function TreeSkeleton() {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  )
}

Tree.Skeleton = TreeSkeleton
