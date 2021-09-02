import { BufferGeometry, BufferAttribute, Mesh, Material } from 'three'
import { STLLoader } from "three-stdlib"
import fileDialog from 'file-dialog'
import toIndexed from './toIndexed'

type importParams = {
  geometryRef: React.MutableRefObject<BufferGeometry | undefined>
  setTransformable: (p:boolean)=>void
  setModel: (p:string|undefined)=>void
  setNeedsUpdate: (p:boolean)=>void,
  setState?: (p:{
    buffer: BufferAttribute,
    current?: boolean
  }[])=>void
}

export async function importModel ({
  geometryRef,
  setTransformable,
  setModel,
  setNeedsUpdate,
}:importParams ){
    setTransformable(false)
    const dialog = await fileDialog()
    const buffer = await dialog[0].arrayBuffer()
    const bufferGeometry = new STLLoader().parse(buffer)
    //@ts-ignore
    BufferGeometry.prototype.toIndexed = toIndexed
    //@ts-ignore
    const indexed = bufferGeometry.toIndexed()
    const count = indexed.attributes.position.count
    const array = new Float32Array(count*2)
    new Array(count).map((v,i)=>[i/(count+1), (i+1)/(count+1)]).flat().forEach((v,i)=>{array[i]=v})
    indexed.setAttribute(
      'uv', 
      new BufferAttribute(
        array, 
      2))
    geometryRef.current= indexed
    setModel(dialog[0].name)
    setNeedsUpdate(true)
}