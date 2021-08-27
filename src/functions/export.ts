import { Mesh, BufferGeometry, Material } from 'three'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { v4 as uuid} from 'uuid'
import { download } from './download'

type exportParams = {
  modelRef: React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]> | undefined>
  setTransformable: (p:boolean)=>void,
  name: string
}

export async function exportModel ({
  modelRef,
  setTransformable,
  name
}:exportParams){
  if(modelRef.current){
    setTransformable(false)
    const exporter = new STLExporter()
    const stlFormatted = exporter.parse(modelRef.current, {binary:true})
    console.log(stlFormatted, origin)
    const file = new File([stlFormatted],`${uuid()}.stl`, {type: "model/stl"})    
    console.log(new Date().toJSON().slice(0,10))
    download(file,`${name}.stl`)
  }
}