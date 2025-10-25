"use client"
import { use } from "react"

interface NodePageProps {
  params: Promise<{
    nodeId: string
  }>
}

export default function NodePage({ params }: NodePageProps) {
  const { nodeId } = use(params)
  return (
    <div>
      <h1>Node {nodeId}</h1>
    </div>
  )
}