# 家族树组件

为博客添加一个“无界”且具备高扩展性的家族树组件。

拥有两种视图

1. 家族树视图：近展示围绕主角的家族关系，展示人物之间的血缘关系。
2. 星形网络视图：展示人物之间的关系，如工作、政治、商业等。


## 核心技术选型

为了实现“无界（Canvas-like 拖拽缩放）”以及高定制化的节点（Badges）和连线（文字），使用 **React Flow**


## 技术方案

### 1. 数据结构设计 (Data Structure)

将人物视为 node，将关系视为 edge。

数据结构有以下类型：

- node
  - 人物节点
  - 虚拟婚姻节点
- edge
  - 人物之间的关系

```typescript
// types.ts
import { Node, Edge } from 'reactflow';

// ==========================================
// 1. 节点分类与范畴定义
// ==========================================

/**
 * 人物范畴：决定节点在星形网络中的视觉归类
 */
export type PersonCategory = 
  | 'family'        // 梅耶/格雷厄姆大家族血亲
  | 'professional'  // 职场/管理层（如邮报高管、董事）
  | 'media'         // 新闻界/编辑部战友（如总编、水门事件记者）
  | 'political'     // 政界人物（如肯尼迪总统、麦克纳马拉）
  | 'business'      // 商业伙伴/投资人（如巴菲特）
  | 'social';       // 纯私人朋友/社交圈密友
  | 'other';        // 其他人物

// ==========================================
// 2. 真实人物节点类型 (Person Node)
// ==========================================

export interface BiographyPersonData {
  name: string;               // 姓名，如 "Katharine Graham"
  birthDeath?: string;        // 生卒年，如 "1917–2001"
  category: PersonCategory;   // 人物范畴
  title?: string;             // 核心头衔
  badges?: string[];          // 特殊标签
  avatarUrl?: string;         
  bioSummary?: string;        // 点击节点时侧边栏展示的详细传记
  
  // 视图专属布局元数据
  viewMeta?: {
    familyTree?: {
      generation: number;     // 世代层级
    };
    starNetwork?: {
      ring: 'center' | 'inner' | 'outer'; // 处于星形网的哪一圈
    };
  };
}

/**
 * 真实的传记人物节点
 */
export type PersonNode = Node<BiographyPersonData> & {
  type: 'biographyPersonNode';
};

// ==========================================
// 3. 虚拟婚姻节点类型 (Marriage Node)
// ==========================================

export interface MarriageNodeData {
  // 虚拟节点极其轻量，几乎不需要展示文本，甚至在星形网视图下会被完全隐藏
  label?: string;             // 预留，例如可写 "婚姻" 或 "联姻"
  husbandId: string;          // 记录关联的丈夫 ID，方便布局算法溯源
  wifeId: string;             // 记录关联的妻子 ID
}

/**
 * 虚拟的婚姻交汇节点
 */
export type MarriageNode = Node<MarriageNodeData> & {
  type: 'marriageNode';
};

/**
 * 联合类型：React Flow 最终接收的节点数组，是由人物节点和婚姻节点混合组成的
 */
export type CustomNode = PersonNode | MarriageNode;


// ==========================================
// 4. 连线（Edge/Link）相关类型定义
// ==========================================

export type RelationshipType = 
  | 'blood'         // 血缘关系（父母/子女）
  | 'marriage'      // 婚姻关系（夫妻连向婚姻节点）
  | 'employ'        // 雇佣/上下级
  | 'peer'          // 同僚/新闻战友
  | 'ally'          // 政治盟友
  | 'mentor'        // 商业/精神导师
  | 'friendship';   // 纯友谊

export interface RelationshipEdgeData {
  relationshipType: RelationshipType;
  label?: string;            // 连线上展现的简短文字，如 "长子"、"密友"
  description?: string;      // 关系的详细文字背景
}

export type CustomEdge = Edge<RelationshipEdgeData> & {
  type: 'customRelationEdge';
};


// ==========================================
// 5. 新数据结构下的静态数据编写示例
// ==========================================

export const mockBiographyData: { nodes: CustomNode[]; edges: CustomEdge[] } = {
  nodes: [
    // 1. 传记主角（人物节点）
    {
      id: 'katharine',
      type: 'biographyPersonNode',
      position: { x: 200, y: 300 },
      data: {
        name: 'Katharine Graham',
        birthDeath: '1917–2001',
        category: 'family',
        title: '华盛顿邮报女主人',
        badges: ['自传主角', '普利策奖'],
        viewMeta: {
          familyTree: { generation: 1 },
          starNetwork: { ring: 'center' }
        }
      }
    },
    // 2. 主角丈夫（人物节点）
    {
      id: 'philip',
      type: 'biographyPersonNode',
      position: { x: 400, y: 300 },
      data: {
        name: 'Philip Graham',
        birthDeath: '1915–1963',
        category: 'family',
        title: '前华盛顿邮报总裁',
        badges: ['躁郁症'],
        viewMeta: {
          familyTree: { generation: 1 },
          starNetwork: { ring: 'inner' }
        }
      }
    },
    // 3. 完美的解耦：虚拟婚姻节点（无涉人物本身属性）
    {
      id: 'marriage-k-p',
      type: 'marriageNode',
      position: { x: 300, y: 310 }, // 位于夫妻正中间微调处
      data: {
        husbandId: 'philip',
        wifeId: 'katharine',
        label: '结发夫妻'
      }
    },
    // 4. 外部社交关系（朋友/导师节点）
    {
      id: 'buffett',
      type: 'biographyPersonNode',
      position: { x: 0, y: 0 },
      data: {
        name: 'Warren Buffett',
        category: 'business',
        title: '商业导师 / 大股东',
        viewMeta: {
          familyTree: { generation: 1 },
          starNetwork: { ring: 'inner' }
        }
      }
    }
  ],
  edges: [
    // 夫妻双方分别连向“婚姻节点”
    {
      id: 'p-to-m',
      source: 'philip',
      target: 'marriage-k-p',
      type: 'customRelationEdge',
      data: { relationshipType: 'marriage' }
    },
    {
      id: 'k-to-m',
      source: 'katharine',
      target: 'marriage-k-p',
      type: 'customRelationEdge',
      data: { relationshipType: 'marriage' }
    },
    // 外部人物直接与主角连线
    {
      id: 'b-to-k',
      source: 'buffett',
      target: 'katharine',
      type: 'customRelationEdge',
      data: {
        relationshipType: 'mentor',
        label: '商业智囊'
      }
    }
  ]
};

```

---

### 2. 第一版：静态组件实现思路

在第一阶段，我们主要解决**视觉呈现**和**无界画布**的问题。

#### A. 自定义节点 (Custom Node)

React Flow 允许你将任何 React 组件渲染为节点。你可以充分利用 Tailwind CSS 来自由定制你的样式。

```tsx
// FamilyNode.tsx
import React from 'react';
import { Handle, Position } from 'reactflow';

export function FamilyNode({ data }) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[150px]">
      {/* 顶部或内部的 Badges */}
      <div className="flex gap-1 mb-1 flex-wrap">
        {data.badges?.map(badge => (
          <span key={badge} className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-medium">
            {badge}
          </span>
        ))}
      </div>
      
      <div className="font-bold text-sm text-stone-900">{data.name}</div>
      {data.birthDeath && <div className="text-xs text-stone-500">{data.birthDeath}</div>}

      {/* 连接点：用于连线接入 */}
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-stone-400" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-stone-400" />
    </div>
  );
}

```

#### B. 自定义连线 (Custom Edge)

利用 SVG 的 `<textPath>` 或 React Flow 的 `EdgeLabelRenderer`，可以在连线中央渲染文字。

```tsx
// CustomEdge.tsx
import React from 'react';
import { getBezierPath, EdgeLabelRenderer, EdgeProps } from 'reactflow';

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  return (
    <>
      <path id={id} className="react-flow__edge-path stroke-stone-400 stroke-2" d={edgePath} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="bg-stone-100 px-1 py-0.5 text-[11px] text-stone-500 rounded border border-stone-200"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

```

#### C. 画布组装

引入上述自定义类型，并将 `panOnScroll`、`zoomOnPinch` 等属性开启，即可获得丝滑的“无界”大地图体验。

```tsx
// FamilyTree.tsx
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = { familyNode: FamilyNode };
const edgeTypes = { customEdge: CustomEdge };

export default function FamilyTree() {
  // 第一版：直接硬编码导入静态的 initialNodes 和 initialEdges
  return (
    <div className="w-full h-[600px] border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#ccc" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

```


# 目录结构

在 Next.js（无论是目前主流的 App Router 还是经典的 Pages Router）中，将整个功能先集中在单一页面中，同时为后续的“组件化抽象”和“动态接口升级”留出完美的后路，建议采用“就近原则（Colocation）”来安排文件夹结构。

这样可以确保你现在写的所有代码、类型、静态数据都聚拢在一个盒子里，以后想要打包封装成独立组件时，直接把整个盒子移动到全局 `components` 目录下即可。

以下是为你推荐的文件夹目录结构设计：

---

## 1. 推荐目录结构（以 App Router 为例）

假设你的博客路由是 `/blog/biography-graph`，你可以直接在这个路由文件夹下建立一个专属于该功能的专属模块目录：

```text
next-home/
└── app/
    └── (main)/
        └── playground/
            └── family-tree/
                ├── page.tsx                 # 视图主页面（控制中心、双视图切换状态、React Flow 容器）
                ├── _components/             # 该页面专属的私有组件（下划线前缀，Next.js 会自动忽略路由扫描）
                │   ├── PersonNode.tsx       # 传记真实人物节点（渲染姓名、生卒、Badges）
                │   ├── MarriageNode.tsx     # 虚拟婚姻交汇点（极简微缩圆点或隐形锚点）
                │   ├── CustomRelationEdge.tsx # 自定义连线（根据不同关系类型渲染不同线型及文字 Label）
                │   └── SidebarDrawer.tsx    # 点击节点后从侧边滑出的人物微观传记/详情组件
                ├── _data/
                │   └── biographyData.ts     # 第一版 Katharine Graham 的全量静态 JSON 数据源
                ├── _utils/
                │   └── layoutCalc.ts        # 存放星形辐射极坐标计算、或者未来自动布局的纯函数
                └── _types/
                    └── graph.ts             # 刚刚设计好的重构版 TypeScript 类型定义文件
```

> **设计思路解析：**
> * **`_components` / `_data` 等带下划线的命名**：这是 Next.js 推荐的“私有文件夹”规范。Next.js 的路由扫描器会彻底忽略带下划线的文件夹，因此你可以在路由目录下安全地放置页面专属的各种零碎代码。
> * **就近高内聚**：所有的逻辑都呆在 `biography-graph` 这一个大伞下。你在写 `page.tsx` 时，导入路径全都是 `./_components/PersonNode` 这样的相对路径，不需要去全局目录里翻找，开发体验极好。
> 
> 

---

## 2. 第一版在 `page.tsx` 中的代码组装框架

在第一阶段，你的 `page.tsx` 就是整个功能的大脑。它负责**读取静态数据**、**掌控视图状态**、**分配坐标**并把东西喂给 React Flow。

你可以按照以下骨架来组织你的 `page.tsx`：

```tsx
// src/app/blog/biography-graph/page.tsx
'use client'; // React Flow 强依赖客户端生命周期

import { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

// 1. 就近引入我们设计好的数据、类型与自定义渲染组件
import { mockBiographyData } from './_data/biographyData';
import { CustomNode, CustomEdge } from './_types/graph';
import { PersonNodeComponent } from './_components/PersonNode';
import { MarriageNodeComponent } from './_components/MarriageNode';
import { CustomRelationEdgeComponent } from './_components/CustomRelationEdge';
import { SidebarDrawer } from './_components/SidebarDrawer';

// 2. 注册 React Flow 的自定义节点和连线映射
const nodeTypes = {
  biographyPersonNode: PersonNodeComponent,
  marriageNode: MarriageNodeComponent,
};

const edgeTypes = {
  customRelationEdge: CustomRelationEdgeComponent,
};

export default function BiographyGraphPage() {
  // 3. React Flow 的核心 State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // 4. 控制双视图切换的状态 & 控制侧边栏抽屉的状态
  const [viewMode, setViewMode] = useState<'family' | 'star'>('family');
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  // 5. 核心副作用：监听 viewMode，动态计算或者覆写静态数据的 position 坐标
  useEffect(() => {
    const { nodes: rawNodes, edges: rawEdges } = mockBiographyData;

    if (viewMode === 'family') {
      // 执行家族树的坐标逻辑（比如根据 generation 算出 y 轴）
      // 第一版也可以直接在静态数据里写好两套 position，在这里直接读取赋予
      // ... 过滤或映射逻辑
      setNodes(familyPositionedNodes);
      setEdges(familyEdges);
    } else {
      // 执行以主角为中心的星形辐射极坐标计算
      // ... 极坐标计算逻辑
      setNodes(starPositionedNodes);
      setEdges(rawEdges); // 星形网把外部社交、利益线全部放开
    }
  }, [viewMode]);

  // 6. 节点点击事件：把被点击的人物数据塞给侧边栏
  const onNodeClick = (_event: React.MouseEvent, node: CustomNode) => {
    if (node.type === 'biographyPersonNode') {
      setSelectedPerson(node.data); // 虚拟婚姻节点不触发侧边栏
    }
  };

  return (
    <main className="w-full h-screen relative flex flex-col bg-stone-50">
      {/* 顶部控制栏 */}
      <header className="p-4 bg-white border-b border-stone-200 flex justify-between items-center z-10">
        <h1 className="font-serif text-xl">《个人历史》传记关系全景图谱</h1>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('family')} className={`px-3 py-1.5 text-xs rounded ${viewMode === 'family' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}>
            家族继承树
          </button>
          <button onClick={() => setViewMode('star')} className={`px-3 py-1.5 text-xs rounded ${viewMode === 'star' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}>
            凯瑟琳辐射网
          </button>
        </div>
      </header>

      {/* React Flow 无界画布主容器 */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background color="#e7e5e4" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* 侧边栏抽屉：展示微观传记 */}
      <SidebarDrawer person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </main>
  );
}

```

---

## 3. 这样安排对后续升级有什么好处？

1. **零成本抽象**：当你在这一页彻底调顺了样式和计算逻辑后，如果要把它做成可以在多篇博客里复用的全局通用组件，你只需要做一件事——把整个 `_components`、`_types`、`_utils` 剪切到全局 `src/components/BiographyGraph/` 目录下，并把 `page.tsx` 里的 `mockBiographyData` 改为作为组件的 `props` 传入即可。
2. **平滑接入 Payload CMS / API**：后续你想做动态编辑时，只需要把 `_data/biographyData.ts` 这个静态文件删掉，在 `page.tsx` 中改用 `fetch()` 或 `useSWR` 去请求你的后端接口（比如从 Payload CMS 动态读取 JSON），页面的核心渲染逻辑不需要改动半个字。