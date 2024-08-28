import { bytesToHex, keccak256 } from 'viem'

export function createMerkleTree(props: { elements: Buffer[] }) {
  const sortedElements = [...props.elements].sort((a, b) => a.compare(b))
  const dedupedElements = bufDedup(sortedElements)

  const bufferElementPositionIndex = dedupedElements.reduce<Record<string, number>>((memo, el, index) => {
    memo[bytesToHex(el)] = index
    return memo
  }, {})

  const layers = getLayers({ elements: dedupedElements })

  function getRoot() {
    return layers[layers.length - 1]?.[0]
  }

  function getHexRoot() {
    const root = getRoot()
    if (!root) throw new Error('empty tree')
    return bytesToHex(root)
  }

  function getProof(props: { el: Buffer }) {
    let idx = bufferElementPositionIndex[bytesToHex(props.el)]

    if (typeof idx !== 'number') {
      throw new Error('Element does not exist in Merkle tree')
    }

    return layers.reduce((proof, layer) => {
      if (idx === undefined) return proof
      const pairElement = getPairElement({ idx, layer })

      if (pairElement) {
        proof.push(pairElement)
      }

      idx = Math.floor(idx / 2)

      return proof
    }, [] as Buffer[])
  }

  function getHexProof(props: { el: Buffer }) {
    const proof = getProof(props)
    return bufArrToHexArr(proof)
  }

  return {
    getRoot,
    getHexRoot,
    getProof,
    getHexProof,
  }
}

function getLayers(props: { elements: Buffer[] }): (Buffer | undefined)[][] {
  if (props.elements.length === 0) {
    throw new Error('empty tree')
  }

  const layers = []
  layers.push(props.elements)


  while ((layers[layers.length - 1]?.length ?? 0) > 1) {
    layers.push(getNextLayer({ elements: layers[layers.length - 1] ?? [] }))
  }

  return layers
}

function getNextLayer(props: { elements: (Buffer | undefined)[] }): (Buffer | undefined)[] {
  return props.elements.reduce<(Buffer | undefined)[]>((layer, el, idx) => {
    if (idx % 2 === 0) {
      layer.push(combinedHash({ first: el, second: props.elements[idx + 1] }))
    }
    return layer
  }, [])
}

function combinedHash(props: { first: Buffer | undefined; second: Buffer | undefined }): Buffer | undefined {
  if (!props.first) {
    return props.second
  }
  if (!props.second) {
    return props.first
  }

  return Buffer.from(keccak256(sortAndConcat(props.first, props.second)).slice(2), 'hex')
}

function getPairElement(props: { idx: number; layer: (Buffer | undefined)[] }): Buffer | undefined {
  const pairIdx = props.idx % 2 === 0 ? props.idx + 1 : props.idx - 1

  if (pairIdx < props.layer.length) {
    return props.layer[pairIdx]
  } else {
    return undefined
  }
}

function bufDedup(elements: Buffer[]): Buffer[] {
  return elements.filter((el, idx) => {
    return idx === 0 || !elements[idx - 1]?.equals(el)
  })
}

function bufArrToHexArr(arr: (Buffer | undefined)[]): (`0x${string}` | undefined)[] {
  if (arr.some((el) => !Buffer.isBuffer(el))) {
    throw new Error('Array is not an array of buffers')
  }

  return arr.map((el) => el ? bytesToHex(el) : undefined)
}

function sortAndConcat(...args: Buffer[]): Buffer {
  return Buffer.concat([...args].sort((a, b) => a.compare(b)))
}
