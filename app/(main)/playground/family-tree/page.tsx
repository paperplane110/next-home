"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type EdgeMouseHandler,
  type OnNodeDrag,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type EdgeTypes,
  type NodeMouseHandler,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FolderOpen, Network, Save, WaypointsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { CustomRelationEdge } from "./_components/custom-relation-edge";
import { EdgeEditorDrawer } from "./_components/edge-editor-drawer";
import { MarriageNode } from "./_components/marriage-node";
import { PersonEditorDrawer } from "./_components/person-editor-drawer";
import { PersonNode } from "./_components/person-node";
import { SidebarDrawer } from "./_components/sidebar-drawer";
import { ToolIconButton } from "./_components/tool-icon-button";
import { biographyData } from "./_data/biography-data";
import type {
  BiographyPersonData,
  CustomEdge,
  CustomNode,
  EdgeEditorState,
  EdgeFormDraft,
  GraphDataset,
  GraphViewMode,
  PersonEditorState,
  PersonFormDraft,
  PersonNode as PersonNodeType,
  RelationshipType,
} from "./_types/graph";
import { createMarriageStructure } from "./_utils/create-marriage-structure";
import { createPersonNode } from "./_utils/create-person-node";
import {
  ALL_RELATIONSHIP_TYPES,
  createDefaultRelationshipEdgeData,
  createEdgeFormDraft,
  FAMILY_RELATIONSHIP_TYPES,
  MARRIAGE_ONLY_RELATIONSHIP_TYPES,
  sanitizeEdgeFormDraft,
} from "./_utils/edge-meta";
import { buildViewGraph, toFamilyDraftPosition } from "./_utils/layout-calc";
import { createPersonFormDraft, mergePersonDraftIntoNode } from "./_utils/person-form";

const nodeTypes: NodeTypes = {
  biographyPersonNode: PersonNode,
  marriageNode: MarriageNode,
};

const edgeTypes: EdgeTypes = {
  customRelationEdge: CustomRelationEdge,
};

interface EdgeContextMenuState {
  edgeId: string;
  x: number;
  y: number;
}

function createEdgeId() {
  return `edge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;

  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
}

function isTextareaTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.tagName === "TEXTAREA" || target.isContentEditable);
}

function getNodeDisplayName(node: CustomNode) {
  if (node.type === "biographyPersonNode") {
    return node.data.name;
  }

  return node.data.label || "夫妻";
}

function getAllowedRelationshipTypes(
  sourceNode: CustomNode,
  targetNode: CustomNode,
): RelationshipType[] {
  if (sourceNode.type === "marriageNode") {
    return FAMILY_RELATIONSHIP_TYPES;
  }

  if (targetNode.type === "marriageNode") {
    return MARRIAGE_ONLY_RELATIONSHIP_TYPES;
  }

  return ALL_RELATIONSHIP_TYPES;
}

function createRelationshipEdge(
  connection: Connection,
  viewMode: GraphViewMode,
  relationshipType: RelationshipType = "other",
): CustomEdge | null {
  if (!connection.source || !connection.target) {
    return null;
  }

  return {
    id: createEdgeId(),
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    type: "customRelationEdge",
    data: createDefaultRelationshipEdgeData(viewMode, relationshipType),
  };
}

export default function FamilyTreePage() {
  const [viewMode, setViewMode] = useState<GraphViewMode>("family");
  const [selectedPersonId, setSelectedPersonId] = useState("katharine");
  const [graphDraft, setGraphDraft] = useState<GraphDataset>(biographyData);
  const [editorState, setEditorState] = useState<PersonEditorState>({
    open: false,
    mode: "create",
    personId: null,
  });
  const [personFormDraft, setPersonFormDraft] = useState<PersonFormDraft>(
    createPersonFormDraft(),
  );
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [edgeEditorState, setEdgeEditorState] = useState<EdgeEditorState>({
    open: false,
    edgeId: null,
  });
  const [edgeFormDraft, setEdgeFormDraft] = useState<EdgeFormDraft>(createEdgeFormDraft());
  const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuState | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance<CustomNode, CustomEdge> | null
  >(null);
  const edgeContextMenuRef = useRef<HTMLDivElement | null>(null);

  const viewGraph = useMemo(() => buildViewGraph(graphDraft, viewMode), [graphDraft, viewMode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(viewGraph.edges);

  const selectedPerson = useMemo(() => {
    const foundNode = graphDraft.nodes.find(
      (node): node is Extract<CustomNode, { type: "biographyPersonNode" }> =>
        node.type === "biographyPersonNode" && node.id === selectedPersonId,
    );

    return foundNode?.data ?? null;
  }, [graphDraft.nodes, selectedPersonId]);

  const selectedEdge = useMemo(
    () => graphDraft.edges.find((edge) => edge.id === selectedEdgeId) ?? null,
    [graphDraft.edges, selectedEdgeId],
  );

  const edgeEditorContext = useMemo(() => {
    if (!selectedEdge) {
      return null;
    }

    const sourceNode = graphDraft.nodes.find((node) => node.id === selectedEdge.source);
    const targetNode = graphDraft.nodes.find((node) => node.id === selectedEdge.target);

    if (!sourceNode || !targetNode) {
      return null;
    }

    return {
      sourceNode,
      targetNode,
      sourceName: getNodeDisplayName(sourceNode),
      targetName: getNodeDisplayName(targetNode),
      relationshipTypes: getAllowedRelationshipTypes(sourceNode, targetNode),
    };
  }, [graphDraft.nodes, selectedEdge]);

  const handleEditPerson = useCallback(
    (personId: string) => {
      const targetNode = graphDraft.nodes.find(
        (node): node is Extract<CustomNode, { type: "biographyPersonNode" }> =>
          node.type === "biographyPersonNode" && node.id === personId,
      );

      if (!targetNode) {
        return;
      }

      setSelectedPersonId(personId);
      setPersonFormDraft(createPersonFormDraft(targetNode.data));
      setEditorState({
        open: true,
        mode: "edit",
        personId,
      });
    },
    [graphDraft.nodes],
  );

  const handleDeletePerson = useCallback((personId: string) => {
    const removedEdgeIds = new Set(
      graphDraft.edges
        .filter((edge) => edge.source === personId || edge.target === personId)
        .map((edge) => edge.id),
    );

    setGraphDraft((currentGraph) => ({
      ...currentGraph,
      nodes: currentGraph.nodes.filter(
        (node) => !(node.id === personId && node.type === "biographyPersonNode"),
      ),
      edges: currentGraph.edges.filter(
        (edge) => edge.source !== personId && edge.target !== personId,
      ),
    }));
    setSelectedPersonId((currentId) => (currentId === personId ? "" : currentId));
    setEditorState((currentState) =>
      currentState.personId === personId
        ? {
            open: false,
            mode: "create",
            personId: null,
          }
        : currentState,
    );
    setPersonFormDraft(createPersonFormDraft());
    setSelectedEdgeId((currentId) => (currentId && removedEdgeIds.has(currentId) ? null : currentId));
    setEdgeEditorState((currentState) =>
      currentState.edgeId && removedEdgeIds.has(currentState.edgeId)
        ? {
            open: false,
            edgeId: null,
          }
        : currentState,
    );
    setEdgeFormDraft(createEdgeFormDraft());
  }, [graphDraft.edges]);

  const interactiveNodes = useMemo<CustomNode[]>(
    () =>
      viewGraph.nodes.map((node) => {
        if (node.type !== "biographyPersonNode") {
          return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            actions: {
              onEdit: handleEditPerson,
              onDelete: handleDeletePerson,
            },
          },
        } satisfies PersonNodeType;
      }),
    [handleDeletePerson, handleEditPerson, viewGraph.nodes],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(interactiveNodes);

  useEffect(() => {
    setNodes(interactiveNodes);
    setEdges(viewGraph.edges);
  }, [interactiveNodes, setEdges, setNodes, viewGraph.edges]);

  const edgeContextMenuContent =
    edgeContextMenu && typeof window !== "undefined"
      ? createPortal(
          <div
            ref={edgeContextMenuRef}
            className="fixed z-60 min-w-[140px] rounded-xl border border-stone-200/90 bg-white/95 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md"
            style={{
              left: edgeContextMenu.x + 8,
              top: edgeContextMenu.y + 4,
            }}
          >
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-between gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDeleteRelationshipEdge(edgeContextMenu.edgeId)}
            >
              <span>
                删除关系
              </span>
              <Kbd className="text-destructive">⌦</Kbd>
            </Button>
          </div>,
          document.body,
        )
      : null;

  useEffect(() => {
    if (!edgeContextMenu) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        edgeContextMenuRef.current &&
        event.target instanceof Node &&
        edgeContextMenuRef.current.contains(event.target)
      ) {
        return;
      }

      setEdgeContextMenu(null);
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [edgeContextMenu]);

  function clearEdgeSelection() {
    setSelectedEdgeId(null);
    setEdgeContextMenu(null);
  }

  const handleNodeClick: NodeMouseHandler<CustomNode> = (_, node) => {
    clearEdgeSelection();

    if (node.type === "biographyPersonNode") {
      setSelectedPersonId(node.id);
    }
  };

  const handleNodeDoubleClick: NodeMouseHandler<CustomNode> = (event, node) => {
    if (node.type !== "biographyPersonNode") {
      return;
    }

    event.stopPropagation();
    handleEditPerson(node.id);
  };

  const openEdgeEditor = useCallback(
    (edgeId: string) => {
      const targetEdge = graphDraft.edges.find((edge) => edge.id === edgeId);

      if (!targetEdge) {
        return;
      }

      setSelectedEdgeId(edgeId);
      setEdgeContextMenu(null);
      setEdgeFormDraft(createEdgeFormDraft(targetEdge.data));
      setEdgeEditorState({
        open: true,
        edgeId,
      });
    },
    [graphDraft.edges],
  );

  const isValidConnection = useCallback(
    (edgeOrConnection: Connection | CustomEdge) => {
      if (
        !edgeOrConnection.source ||
        !edgeOrConnection.target ||
        edgeOrConnection.source === edgeOrConnection.target
      ) {
        return false;
      }

      const sourceNode = graphDraft.nodes.find((node) => node.id === edgeOrConnection.source);
      const targetNode = graphDraft.nodes.find((node) => node.id === edgeOrConnection.target);

      if (!sourceNode || !targetNode) {
        return false;
      }

      if (sourceNode.type === "marriageNode") {
        return (
          targetNode.type === "biographyPersonNode" &&
          !graphDraft.edges.some(
            (edge) =>
              edge.source === edgeOrConnection.source && edge.target === edgeOrConnection.target,
          )
        );
      }

      if (targetNode.type === "marriageNode") {
        return (
          sourceNode.type === "biographyPersonNode" &&
          !graphDraft.edges.some(
            (edge) =>
              edge.source === edgeOrConnection.source && edge.target === edgeOrConnection.target,
          )
        );
      }

      return (
        sourceNode.type === "biographyPersonNode" &&
        targetNode.type === "biographyPersonNode" &&
        !graphDraft.edges.some(
          (edge) =>
            edge.source === edgeOrConnection.source && edge.target === edgeOrConnection.target,
        )
      );
    },
    [graphDraft.edges, graphDraft.nodes],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      const sourceNode = graphDraft.nodes.find((node) => node.id === connection.source);
      const targetNode = graphDraft.nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) {
        return;
      }

      if (
        sourceNode.type !== "biographyPersonNode" &&
        sourceNode.type !== "marriageNode"
      ) {
        return;
      }

      if (
        targetNode.type !== "biographyPersonNode" &&
        targetNode.type !== "marriageNode"
      ) {
        return;
      }

      const defaultRelationshipType: RelationshipType =
        sourceNode.type === "marriageNode"
          ? "blood"
          : targetNode.type === "marriageNode"
            ? "marriage"
            : "other";
      const newEdge = createRelationshipEdge(connection, viewMode, defaultRelationshipType);

      if (!newEdge) {
        return;
      }

      setGraphDraft((currentGraph) => ({
        ...currentGraph,
        edges: [...currentGraph.edges, newEdge],
      }));
      setSelectedEdgeId(newEdge.id);
      setEdgeContextMenu(null);
    },
    [graphDraft.nodes, viewMode],
  );

  const handleEdgeClick: EdgeMouseHandler<CustomEdge> = (event, edge) => {
    event.stopPropagation();
    setSelectedPersonId("");
    setSelectedEdgeId(edge.id);
    setEdgeContextMenu(null);
  };

  const handleEdgeDoubleClick: EdgeMouseHandler<CustomEdge> = (event, edge) => {
    event.stopPropagation();
    openEdgeEditor(edge.id);
  };

  const handleEdgeContextMenu: EdgeMouseHandler<CustomEdge> = (event, edge) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedPersonId("");
    setSelectedEdgeId(edge.id);
    setEdgeContextMenu({
      edgeId: edge.id,
      x: event.clientX,
      y: event.clientY,
    });
  };

  function startCreatePersonAtPosition(position: { x: number; y: number }) {
    const nextOuterOrder = graphDraft.nodes.filter(
      (node) => node.type === "biographyPersonNode" && node.data.viewMeta.starNetwork?.ring === "outer",
    ).length;
    const newNode = createPersonNode(position, nextOuterOrder);

    setGraphDraft((currentGraph) => ({
      ...currentGraph,
      nodes: [...currentGraph.nodes, newNode],
    }));
    setSelectedPersonId(newNode.id);
    setPersonFormDraft(createPersonFormDraft(newNode.data));
    setEditorState({
      open: true,
      mode: "create",
      personId: newNode.id,
    });
  }

  function startCreatePersonFromClientPoint(clientX: number, clientY: number) {
    if (!reactFlowInstance) {
      return;
    }

    const flowPosition = reactFlowInstance.screenToFlowPosition({ x: clientX, y: clientY });
    startCreatePersonAtPosition(flowPosition);
  }

  function handlePaneClick(event: MouseEvent | React.MouseEvent) {
    setEdgeContextMenu(null);
    setSelectedEdgeId(null);

    if (event.detail !== 2) {
      return;
    }

    startCreatePersonFromClientPoint(event.clientX, event.clientY);
  }

  const handleNodeDragStop: OnNodeDrag<CustomNode> = (_, node) => {
    setGraphDraft((currentGraph) => ({
      ...currentGraph,
      nodes: currentGraph.nodes.map((currentNode) => {
        if (currentNode.id !== node.id) {
          return currentNode;
        }

        if (currentNode.type === "biographyPersonNode" && node.type === "biographyPersonNode") {
          const familyPosition =
            viewMode === "family"
              ? toFamilyDraftPosition(node.position)
              : currentNode.data.viewMeta.familyTree?.position ?? toFamilyDraftPosition(node.position);

          const starPosition =
            viewMode === "star"
              ? node.position
              : currentNode.data.viewMeta.starNetwork?.position ?? node.position;

          return {
            ...currentNode,
            position: viewMode === "family" ? familyPosition : node.position,
            data: {
              ...currentNode.data,
              viewMeta: {
                ...currentNode.data.viewMeta,
                familyTree: {
                  generation: currentNode.data.viewMeta.familyTree?.generation ?? 1,
                  position: familyPosition,
                },
                starNetwork: {
                  ring: currentNode.data.viewMeta.starNetwork?.ring ?? "outer",
                  order: currentNode.data.viewMeta.starNetwork?.order ?? 0,
                  position: starPosition,
                },
              },
            },
          } satisfies PersonNodeType;
        }

        if (currentNode.type === "marriageNode" && node.type === "marriageNode") {
          return {
            ...currentNode,
            position: viewMode === "family" ? toFamilyDraftPosition(node.position) : node.position,
            data: {
              ...currentNode.data,
              viewMeta: {
                ...currentNode.data.viewMeta,
                familyTree: {
                  position:
                    viewMode === "family"
                      ? toFamilyDraftPosition(node.position)
                      : currentNode.data.viewMeta.familyTree?.position ?? node.position,
                },
              },
            },
          };
        }

        return currentNode;
      }),
    }));
  };

  const handleEditorOpenChange = useCallback((open: boolean) => {
    setEditorState((currentState) => ({
      ...currentState,
      open,
    }));
  }, []);

  const handleSubmitPersonEditor = useCallback(() => {
    if (!editorState.personId) {
      return;
    }

    setGraphDraft((currentGraph) => ({
      ...currentGraph,
      nodes: currentGraph.nodes.map((currentNode) => {
        if (
          currentNode.id === editorState.personId &&
          currentNode.type === "biographyPersonNode"
        ) {
          return mergePersonDraftIntoNode(currentNode, personFormDraft);
        }

        return currentNode;
      }),
    }));
    setEditorState((currentState) => ({
      ...currentState,
      open: false,
    }));
  }, [editorState.personId, personFormDraft]);

  const handleEdgeEditorOpenChange = useCallback((open: boolean) => {
    setEdgeEditorState((currentState) => ({
      ...currentState,
      open,
      edgeId: open ? currentState.edgeId : null,
    }));

    if (!open) {
      setSelectedEdgeId(null);
      setEdgeFormDraft(createEdgeFormDraft());
    }
  }, []);

  const handleDeleteRelationshipEdge = useCallback((edgeId: string) => {
    setGraphDraft((currentGraph) => ({
      ...currentGraph,
      edges: currentGraph.edges.filter((edge) => edge.id !== edgeId),
    }));
    setSelectedEdgeId((currentId) => (currentId === edgeId ? null : currentId));
    setEdgeContextMenu((currentMenu) =>
      currentMenu?.edgeId === edgeId ? null : currentMenu,
    );
    setEdgeEditorState((currentState) =>
      currentState.edgeId === edgeId
        ? {
            open: false,
            edgeId: null,
          }
        : currentState,
    );
    setEdgeFormDraft(createEdgeFormDraft());
  }, []);

  const handleSubmitEdgeEditor = useCallback(() => {
    if (!selectedEdge || !edgeEditorContext) {
      return;
    }

    const nextDraft = sanitizeEdgeFormDraft(edgeFormDraft);
    const allowedRelationshipTypes = edgeEditorContext.relationshipTypes;
    const relationshipType = allowedRelationshipTypes.includes(nextDraft.relationshipType)
      ? nextDraft.relationshipType
      : allowedRelationshipTypes[0];

    if (
      relationshipType === "marriage" &&
      edgeEditorContext.sourceNode.type === "biographyPersonNode" &&
      edgeEditorContext.targetNode.type === "biographyPersonNode"
    ) {
      const { marriageNode, marriageEdges } = createMarriageStructure(
        edgeEditorContext.sourceNode,
        edgeEditorContext.targetNode,
      );

      setGraphDraft((currentGraph) => ({
        ...currentGraph,
        nodes: [...currentGraph.nodes, marriageNode],
        edges: [
          ...currentGraph.edges.filter((edge) => edge.id !== selectedEdge.id),
          ...marriageEdges,
        ],
      }));
      setSelectedEdgeId(null);
      setEdgeContextMenu(null);
      setEdgeEditorState({
        open: false,
        edgeId: null,
      });
      setEdgeFormDraft(createEdgeFormDraft());
      return;
    }

    setGraphDraft((currentGraph) => ({
      ...currentGraph,
      edges: currentGraph.edges.map((edge): CustomEdge =>
        edge.id === selectedEdge.id
          ? {
              ...edge,
              data: {
                relationshipType,
                label: nextDraft.label,
                description: nextDraft.description,
                views: edge.data?.views ?? selectedEdge.data?.views ?? [viewMode],
              },
            }
          : edge,
      ),
    }));
    setEdgeEditorState({
      open: false,
      edgeId: null,
    });
    setSelectedEdgeId(null);
    setEdgeContextMenu(null);
    setEdgeFormDraft(createEdgeFormDraft());
  }, [edgeEditorContext, edgeFormDraft, selectedEdge, viewMode]);

  const nextViewMode = viewMode === "family" ? "star" : "family";
  const viewSwitchLabel =
    viewMode === "family" ? "切换到 Social Network 视图" : "切换到 Family Tree 视图";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.isComposing) {
        return;
      }

      if (editorState.open) {
        if (event.key === "Escape") {
          event.preventDefault();
          handleEditorOpenChange(false);
          return;
        }

        if (
          event.key === "Enter" &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey &&
          !isTextareaTarget(event.target) &&
          personFormDraft.name.trim()
        ) {
          event.preventDefault();
          handleSubmitPersonEditor();
        }

        return;
      }

      if (edgeEditorState.open) {
        if (event.key === "Escape") {
          event.preventDefault();
          handleEdgeEditorOpenChange(false);
          return;
        }

        if (
          event.key === "Enter" &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey &&
          !isTextareaTarget(event.target)
        ) {
          event.preventDefault();
          handleSubmitEdgeEditor();
        }

        return;
      }

      if (event.key === "Escape" && edgeContextMenu) {
        event.preventDefault();
        setEdgeContextMenu(null);
        return;
      }

      if (
        event.key === "Backspace" &&
        selectedEdgeId &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        handleDeleteRelationshipEdge(selectedEdgeId);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    edgeContextMenu,
    edgeEditorState.open,
    editorState.open,
    handleDeleteRelationshipEdge,
    handleEditorOpenChange,
    handleEdgeEditorOpenChange,
    handleSubmitPersonEditor,
    handleSubmitEdgeEditor,
    personFormDraft.name,
    selectedEdgeId,
  ]);

  return (
    <div className="relative left-1/2 h-[calc(100vh-8rem-2px)] w-screen -translate-x-1/2 overflow-hidden -mb-16">
      <div className="absolute inset-0">
        <ReactFlow
          key={viewMode}
          onInit={setReactFlowInstance}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeDragStop={handleNodeDragStop}
          onEdgeClick={handleEdgeClick}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          onEdgeContextMenu={handleEdgeContextMenu}
          onPaneClick={handlePaneClick}
          onConnect={handleConnect}
          isValidConnection={isValidConnection}
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

      <div className="pointer-events-none absolute left-4 top-4 z-20  md:top-6">
        <div className="pointer-events-auto rounded-[24px] border border-stone-200/80 bg-white/20 px-5 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-lg">
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
        <div className="pointer-events-auto rounded-[24px] border border-stone-200/80 bg-white/88 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-1">
            <ToolIconButton label={viewSwitchLabel} active onClick={() => setViewMode(nextViewMode)}>
              {viewMode === "family" ? <Network /> : <WaypointsIcon />}
            </ToolIconButton>
            <ToolIconButton label="保存到本地（即将支持）" disabled>
              <Save />
            </ToolIconButton>
            <ToolIconButton label="从本地加载（即将支持）" disabled>
              <FolderOpen />
            </ToolIconButton>
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
        {/* <div className="pointer-events-auto rounded-[24px] border border-stone-200/80 bg-white/88 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
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
        </div> */}
      </div>

      <PersonEditorDrawer
        open={editorState.open}
        mode={editorState.mode}
        value={personFormDraft}
        onOpenChange={handleEditorOpenChange}
        onChange={setPersonFormDraft}
        onSubmit={handleSubmitPersonEditor}
      />
      <EdgeEditorDrawer
        open={edgeEditorState.open}
        value={edgeFormDraft}
        sourceName={edgeEditorContext?.sourceName ?? ""}
        targetName={edgeEditorContext?.targetName ?? ""}
        relationshipTypes={edgeEditorContext?.relationshipTypes ?? ALL_RELATIONSHIP_TYPES}
        onOpenChange={handleEdgeEditorOpenChange}
        onChange={setEdgeFormDraft}
        onSubmit={handleSubmitEdgeEditor}
      />
      {edgeContextMenuContent}
    </div>
  );
}
