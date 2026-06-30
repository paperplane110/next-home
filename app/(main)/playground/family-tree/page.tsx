"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type EdgeTypes,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CustomRelationEdge } from "./_components/custom-relation-edge";
import { MarriageNode } from "./_components/marriage-node";
import { PersonNode } from "./_components/person-node";
import { SidebarDrawer } from "./_components/sidebar-drawer";
import { biographyData } from "./_data/biography-data";
import type { BiographyPersonData, CustomNode, GraphViewMode } from "./_types/graph";
import { buildViewGraph } from "./_utils/layout-calc";

const nodeTypes: NodeTypes = {
  biographyPersonNode: PersonNode,
  marriageNode: MarriageNode,
};

const edgeTypes: EdgeTypes = {
  customRelationEdge: CustomRelationEdge,
};

export default function FamilyTreePage() {
  const [viewMode, setViewMode] = useState<GraphViewMode>("family");
  const [selectedPersonId, setSelectedPersonId] = useState("katharine");

  const viewGraph = useMemo(() => buildViewGraph(biographyData, viewMode), [viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(viewGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(viewGraph.edges);

  useEffect(() => {
    setNodes(viewGraph.nodes);
    setEdges(viewGraph.edges);
  }, [setEdges, setNodes, viewGraph.edges, viewGraph.nodes]);

  const selectedPerson = useMemo(() => {
    const foundNode = viewGraph.nodes.find(
      (node): node is Extract<CustomNode, { type: "biographyPersonNode" }> =>
        node.type === "biographyPersonNode" && node.id === selectedPersonId,
    );

    return foundNode?.data ?? null;
  }, [selectedPersonId, viewGraph.nodes]);

  const handleNodeClick: NodeMouseHandler<CustomNode> = (_, node) => {
    if (node.type === "biographyPersonNode") {
      setSelectedPersonId(node.id);
    }
  };

  return (
    <div className="relative left-1/2 h-[calc(100vh-8rem-2px)] w-screen -translate-x-1/2 overflow-hidden -mb-16">
      <div className="absolute inset-0">
        <ReactFlow
          key={viewMode}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.16, duration: 0 }}
          minZoom={0.35}
          maxZoom={1.6}
          panOnScroll
          selectionOnDrag
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 md:top-6">
        <div className="pointer-events-auto rounded-[24px] border border-stone-200/80 bg-white/20 px-5 py-3 text-center shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-lg">
          <div className="text-lg font-serif font-semibold text-accent-foreground">
            Personal History
          </div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">
            {viewMode === "family"
              ? "The family tree of Katharine Graham"
              : "The network of Katharine Graham"}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-20 flex flex-col items-end gap-3 md:right-6 md:top-6">
        {/* View Mode Switch */}
        <div className="pointer-events-auto rounded-[24px] border border-stone-200/80 bg-white/88 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("family")}
              className={cn(
                "rounded-[18px] px-4 text-sm",
                viewMode === "family"
                  ? "bg-stone-900 text-white hover:bg-stone-900/90 hover:text-white"
                  : "text-stone-600 hover:bg-stone-100",
              )}
            >
              Family Tree
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("star")}
              className={cn(
                "rounded-[18px] px-4 text-sm",
                viewMode === "star"
                  ? "bg-stone-900 text-white hover:bg-stone-900/90 hover:text-white"
                  : "text-stone-600 hover:bg-stone-100",
              )}
            >
              Social Network
            </Button>
          </div>
        </div>
        
        {/* Person Info Sidebar */}
        <div className="pointer-events-auto max-w-[280px]">
          <SidebarDrawer
            person={selectedPerson as BiographyPersonData | null}
            onClose={() => setSelectedPersonId("")}
          />
        </div>

        {/* Legend */}
        <div className="pointer-events-auto rounded-[24px] border border-stone-200/80 bg-white/88 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="space-y-2.5 text-sm text-stone-600">
            {[
              ["amber", "家族 / 血缘"],
              ["emerald", "商业 / 资本"],
              ["sky", "媒体 / 新闻"],
              ["violet", "政治 / 权力"],
            ].map(([tone, label]) => (
              <div key={label} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    tone === "amber" && "bg-amber-400",
                    tone === "emerald" && "bg-emerald-400",
                    tone === "sky" && "bg-sky-400",
                    tone === "violet" && "bg-violet-400",
                  )}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
