"use client";

import type { GraphDataset } from "../_types/graph";

export const biographyData: GraphDataset = {
  nodes: [
    {
      id: "katharine",
      type: "biographyPersonNode",
      position: { x: 240, y: 220 },
      data: {
        name: "Katharine Graham",
        birthDeath: "1917-2001",
        category: "family",
        title: "华盛顿邮报掌舵者",
        badges: ["自传主角", "出版人"],
        bioSummary:
          "凯瑟琳是这张图谱的中心人物。第一视图聚焦她的家族继承关系，第二视图展示她在媒体、政治与商业世界中的辐射网络。",
        viewMeta: {
          familyTree: {
            generation: 1,
            position: { x: 240, y: 220 },
          },
          starNetwork: {
            ring: "center",
            order: 0,
          },
        },
      },
    },
    {
      id: "philip",
      type: "biographyPersonNode",
      position: { x: 490, y: 220 },
      data: {
        name: "Philip Graham",
        birthDeath: "1915-1963",
        category: "family",
        title: "前华盛顿邮报总裁",
        badges: ["丈夫", "邮报继承链"],
        bioSummary:
          "Philip Graham 与 Katharine 通过婚姻节点连接，在家族树里代表核心伴侣关系，在网络视图里则与媒体权力圈重合。",
        viewMeta: {
          familyTree: {
            generation: 1,
            position: { x: 490, y: 220 },
          },
          starNetwork: {
            ring: "inner",
            order: 1,
          },
        },
      },
    },
    {
      id: "agnes",
      type: "biographyPersonNode",
      position: { x: 80, y: 60 },
      data: {
        name: "Agnes Ernst Meyer",
        birthDeath: "1887-1970",
        category: "family",
        title: "母亲",
        badges: ["艺术赞助人"],
        bioSummary:
          "Agnes 代表 Katharine 的上一代家族来源，也让家族视图具备纵向血缘层次。",
        viewMeta: {
          familyTree: {
            generation: 0,
            position: { x: 80, y: 60 },
          },
          starNetwork: {
            ring: "outer",
            order: 0,
          },
        },
      },
    },
    {
      id: "eugene",
      type: "biographyPersonNode",
      position: { x: 310, y: 60 },
      data: {
        name: "Eugene Meyer",
        birthDeath: "1875-1959",
        category: "business",
        title: "父亲 / 实业家",
        badges: ["家族源头", "金融背景"],
        bioSummary:
          "Eugene 是家族与报业权力的起点，也是星形网络视图中商业/权力关系的重要源头。",
        viewMeta: {
          familyTree: {
            generation: 0,
            position: { x: 310, y: 60 },
          },
          starNetwork: {
            ring: "outer",
            order: 1,
          },
        },
      },
    },
    {
      id: "donald",
      type: "biographyPersonNode",
      position: { x: 120, y: 430 },
      data: {
        name: "Donald Graham",
        birthDeath: "1945-",
        category: "family",
        title: "长子 / 后继者",
        badges: ["下一代"],
        bioSummary:
          "Donald 让第一视图能体现家族向下继承的链路，也可作为未来继续添加更多后代节点的锚点。",
        viewMeta: {
          familyTree: {
            generation: 2,
            position: { x: 120, y: 430 },
          },
          starNetwork: {
            ring: "outer",
            order: 2,
          },
        },
      },
    },
    {
      id: "buffett",
      type: "biographyPersonNode",
      position: { x: 760, y: 160 },
      data: {
        name: "Warren Buffett",
        birthDeath: "1930-",
        category: "business",
        title: "商业导师 / 投资人",
        badges: ["商业智囊"],
        bioSummary:
          "Buffett 不是家族树的直系成员，但在星形网络里是重要的商业关系，用来体现关系图模型优于严格树结构。",
        viewMeta: {
          familyTree: {
            generation: 1,
            position: { x: 760, y: 160 },
          },
          starNetwork: {
            ring: "inner",
            order: 2,
          },
        },
      },
    },
    {
      id: "ben-bradlee",
      type: "biographyPersonNode",
      position: { x: 760, y: 340 },
      data: {
        name: "Ben Bradlee",
        birthDeath: "1921-2014",
        category: "media",
        title: "总编辑 / 战友",
        badges: ["新闻同盟"],
        bioSummary:
          "Ben Bradlee 是新闻业务中的关键同僚，适合在网络视图里展示 peer 类型关系与边标签。",
        viewMeta: {
          familyTree: {
            generation: 1,
            position: { x: 760, y: 340 },
          },
          starNetwork: {
            ring: "inner",
            order: 3,
          },
        },
      },
    },
    {
      id: "robert-mcnamara",
      type: "biographyPersonNode",
      position: { x: 760, y: 520 },
      data: {
        name: "Robert McNamara",
        birthDeath: "1916-2009",
        category: "political",
        title: "政界关系人",
        badges: ["政治联系"],
        bioSummary:
          "政治人物节点用来演示星形网络中的跨领域人物连接，以及不同 category 的视觉风格。",
        viewMeta: {
          familyTree: {
            generation: 1,
            position: { x: 760, y: 520 },
          },
          starNetwork: {
            ring: "outer",
            order: 3,
          },
        },
      },
    },
    {
      id: "marriage-kp",
      type: "marriageNode",
      position: { x: 390, y: 320 },
      data: {
        husbandId: "philip",
        wifeId: "katharine",
        label: "婚姻",
        viewMeta: {
          familyTree: {
            position: { x: 390, y: 320},
          },
        },
      },
    },
    {
      id: "marriage-ae",
      type: "marriageNode",
      position: { x: 195, y: 180 },
      data: {
        husbandId: "eugene",
        wifeId: "agnes",
        label: "婚姻",
        viewMeta: {
          familyTree: {
            position: { x: 195, y: 180 },
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "philip-marriage",
      source: "philip",
      target: "marriage-kp",
      type: "customRelationEdge",
      data: {
        relationshipType: "marriage",
        label: "夫妻",
        description: "Philip 与 Katharine 通过虚拟婚姻节点汇合。",
        views: ["family", "star"],
      },
    },
    {
      id: "katharine-marriage",
      source: "katharine",
      target: "marriage-kp",
      type: "customRelationEdge",
      data: {
        relationshipType: "marriage",
        label: "夫妻",
        description: "Katharine 与 Philip 的伴侣关系。",
        views: ["family", "star"],
      },
    },
    {
      id: "agnes-marriage",
      source: "agnes",
      target: "marriage-ae",
      type: "customRelationEdge",
      data: {
        relationshipType: "marriage",
        label: "夫妻",
        description: "Agnes 与 Eugene 的婚姻关系。",
        views: ["family"],
      },
    },
    {
      id: "eugene-marriage",
      source: "eugene",
      target: "marriage-ae",
      type: "customRelationEdge",
      data: {
        relationshipType: "marriage",
        label: "夫妻",
        description: "Eugene 与 Agnes 的婚姻关系。",
        views: ["family"],
      },
    },
    {
      id: "parents-to-katharine",
      source: "marriage-ae",
      target: "katharine",
      type: "customRelationEdge",
      data: {
        relationshipType: "blood",
        label: "女儿",
        description: "父母与 Katharine 的血缘继承关系。",
        views: ["family"],
      },
    },
    {
      id: "marriage-to-donald",
      source: "marriage-kp",
      target: "donald",
      type: "customRelationEdge",
      data: {
        relationshipType: "blood",
        label: "长子",
        description: "Katharine 与 Philip 的后代关系。",
        views: ["family"],
      },
    },
    {
      id: "buffett-to-katharine",
      source: "buffett",
      target: "katharine",
      type: "customRelationEdge",
      data: {
        relationshipType: "mentor",
        label: "商业智囊",
        description: "商业与投资层面的关键关系。",
        views: ["star"],
      },
    },
    {
      id: "bradlee-to-katharine",
      source: "ben-bradlee",
      target: "katharine",
      type: "customRelationEdge",
      data: {
        relationshipType: "peer",
        label: "新闻战友",
        description: "媒体业务中的协作与同盟关系。",
        views: ["star"],
      },
    },
    {
      id: "mcnamara-to-katharine",
      source: "robert-mcnamara",
      target: "katharine",
      type: "customRelationEdge",
      data: {
        relationshipType: "ally",
        label: "政治联系",
        description: "与政界的关键互动关系。",
        views: ["star"],
      },
    },
    {
      id: "philip-to-bradlee",
      source: "philip",
      target: "ben-bradlee",
      type: "customRelationEdge",
      data: {
        relationshipType: "employ",
        label: "业务链路",
        description: "作为管理与编辑体系的一部分。",
        views: ["star"],
      },
    },
  ],
};
