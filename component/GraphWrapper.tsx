// components/GraphWrapper.tsx
'use client'

import { BasicNvlWrapper } from '@neo4j-nvl/react'
import type { Node, Relationship } from '@neo4j-nvl/base'

interface Props {
  nodes: Node[]
  rels: Relationship[]
}

export default function GraphWrapper({ nodes, rels }: Props) {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <BasicNvlWrapper
        nodes={nodes}
        rels={rels}
        nvlOptions={{ initialZoom: 1 }}
      />
    </div>
  )
}