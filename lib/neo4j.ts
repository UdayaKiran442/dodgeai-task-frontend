// lib/neo4j.ts
import neo4j from 'neo4j-driver'
import type { Node, Relationship } from '@neo4j-nvl/base'

const url=process.env.url || ''
const username=process.env.username || ''
const password=process.env.password || ''
const database = process.env.database || ''

const driver = neo4j.driver(url, neo4j.auth.basic(username, password))

export async function fetchGraphNodesRelationships(): Promise<{
  nodes: Node[]
  rels: Relationship[]
}> {
  const result = await driver.executeQuery(
    `MATCH (n)-[r]->(m) RETURN n, r, m`,  // directed → avoids duplicate rows
    {},
    { database }
  )

  const nodeMap = new Map<string, Node>()
  const relMap = new Map<string, Relationship>()

  for (const record of result.records) {
    const n = record.get('n')
    const r = record.get('r')
    const m = record.get('m')

    const nId = n.elementId   // use elementId — stable string, no Integer conversion
    const mId = m.elementId
    const rId = r.elementId

    if (!nodeMap.has(nId)) {
      nodeMap.set(nId, {
        id: nId,
        captions: [{ value: n.labels[0] }, { value: n.properties.value ?? '' }],
      })
    }
    if (!nodeMap.has(mId)) {
      nodeMap.set(mId, {
        id: mId,
        captions: [{ value: m.labels[0] }, { value: m.properties.value ?? '' }],
      })
    }
    if (!relMap.has(rId)) {
      relMap.set(rId, {
        id: rId,
        from: n.elementId,   // must match the node id exactly
        to: m.elementId,
        captions: [{ value: r.type }],
      })
    }
  }

  return {
    nodes: [...nodeMap.values()],
    rels: [...relMap.values()],
  }
}