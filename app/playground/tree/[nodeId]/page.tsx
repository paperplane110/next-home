import { use } from "react"
import { data } from "../layout"

// Return a list of `params` to populate the [nodeId] dynamic segment
export async function generateStaticParams() {
  const nodeIds = data.flatMap((node) => [node.id, ...(node.children?.map((child) => child.id) || [])])
  return nodeIds.map((nodeId) => ({
    nodeId: nodeId.toString(),
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