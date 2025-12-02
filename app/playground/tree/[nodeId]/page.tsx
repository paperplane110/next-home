import { use } from "react"
import { data } from "../layout"

// Return a list of `params` to populate the [nodeId] dynamic segment
export async function generateStaticParams() {
  type TreeNode = { id: string | number; children?: TreeNode[] }
  const collectIds = (nodes: TreeNode[]) => {
    const ids: Array<string | number> = []
    const stack: TreeNode[] = [...nodes]
    while (stack.length) {
      const node = stack.pop()!
      ids.push(node.id)
      if (Array.isArray(node.children) && node.children.length) {
        stack.push(...node.children)
      }
    }
    return ids
  }
  const nodeIds = collectIds(data as unknown as TreeNode[])
  return nodeIds.map((nodeId) => ({
    nodeId: String(nodeId),
  }))
}


interface NodePageProps {
  params: Promise<{
    nodeId: string
  }>
}

export default function NodePage({ params }: NodePageProps) {
  const { nodeId } = use(params)
  return (
    <div>
      <h1 className="text-primary">Detail Page of Node {nodeId}</h1>
    </div>
  )
}
