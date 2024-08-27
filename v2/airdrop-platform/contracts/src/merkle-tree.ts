import { bytesToHex, keccak256 } from 'viem'

export function createMerkleTree(props: { elements: Buffer[] }) {
  const sortedElements = [...props.elements].sort(Buffer.compare)
  const dedupedElements = bufDedup(sortedElements)

  const bufferElementPositionIndex = dedupedElements.reduce<{ [hexElement: string]: number }>((memo, el, index) => {
    memo[bytesToHex(el)] = index
    return memo
  }, {})

  const layers = getLayers({ elements: dedupedElements })

  function getRoot() {
    return layers[layers.length - 1][0]
  }

  function getHexRoot() {
    return bytesToHex(getRoot())
  }

  function getProof(props: { el: Buffer }) {
    let idx = bufferElementPositionIndex[bytesToHex(props.el)]

    if (typeof idx !== 'number') {
      throw new Error('Element does not exist in Merkle tree')
    }

    return layers.reduce((proof, layer) => {
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

function getLayers(props: { elements: Buffer[] }): Buffer[][] {
  if (props.elements.length === 0) {
    throw new Error('empty tree')
  }

  const layers = []
  layers.push(props.elements)

  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer({ elements: layers[layers.length - 1] }))
  }

  return layers
}

function getNextLayer(props: { elements: Buffer[] }): Buffer[] {
  return props.elements.reduce<Buffer[]>((layer, el, idx, arr) => {
    if (idx % 2 === 0) {
      layer.push(combinedHash({ first: el, second: arr[idx + 1] }))
    }
    return layer
  }, [])
}

function combinedHash(props: { first: Buffer; second: Buffer }): Buffer {
  if (!props.first) {
    return props.second
  }
  if (!props.second) {
    return props.first
  }

  return Buffer.from(keccak256(sortAndConcat(props.first, props.second)).slice(2), 'hex')
}

function getPairElement(props: { idx: number; layer: Buffer[] }): Buffer | null {
  const pairIdx = props.idx % 2 === 0 ? props.idx + 1 : props.idx - 1

  if (pairIdx < props.layer.length) {
    return props.layer[pairIdx]
  } else {
    return null
  }
}

function bufDedup(elements: Buffer[]): Buffer[] {
  return elements.filter((el, idx) => {
    return idx === 0 || !elements[idx - 1].equals(el)
  })
}

function bufArrToHexArr(arr: Buffer[]): string[] {
  if (arr.some((el) => !Buffer.isBuffer(el))) {
    throw new Error('Array is not an array of buffers')
  }

  return arr.map((el) => bytesToHex(el))
}

function sortAndConcat(...args: Buffer[]): Buffer {
  return Buffer.concat([...args].sort(Buffer.compare))
}
