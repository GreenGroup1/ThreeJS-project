import { Mesh, BufferGeometry, Material, Camera } from 'three'
import { gzip } from 'pako'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { v4 as uuid} from 'uuid'
import { STLLoader, TransformControls } from "three-stdlib"

type solidifyParams = {
  model: string|undefined
  modelRef: React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]> | undefined>
  geometryRef: React.MutableRefObject<BufferGeometry | undefined>
  transform: React.MutableRefObject<TransformControls<Camera> | null>
  setTransformable: (p:boolean)=>void
  setLoading: (p:boolean)=>void
  setNeedsUpdate: (p:boolean)=>void
  setSolid: (p:boolean)=>void
  setPopups: (p:'emboss'|'solidify'|null)=>void
}

export function solidify ({
  model,
  modelRef,
  geometryRef,
  transform,
  setTransformable,
  setLoading,
  setNeedsUpdate,
  setSolid,
  setPopups
}:solidifyParams){
  if(model && modelRef.current){
    setTransformable(false)
    setLoading(true)
    const exporter = new STLExporter()
    const stlFormatted = exporter.parse(modelRef.current, {binary:true}) as unknown as DataView
    const uint8View = new Uint8Array(stlFormatted.buffer);
    const compressed = gzip(uint8View)
    const compressedFile = compressed.buffer

    const file = new File([compressedFile],`${uuid()}.stl`, {type: "model/stl"})   
    const formData  = new FormData()     
    formData.append('file', file, `${uuid()}.stl`)
    fetch(origin==='http://localhost:3000'?'http://127.0.0.1:5005?align=1':'https://edit.dentalmodelmaker.com?align=1', { 
      method: 'POST',
      body: formData,
      headers: {
        'Content-Encoding': 'gzip'
      }
    }).then(
      response => response.arrayBuffer()
    ).then(
      success => {
        const geometry = new STLLoader().parse(success)
        geometryRef.current=geometry  
        //transform.current?.children[0].object.rotation.set(0,0,0)
        //@ts-ignore
        if(modelRef.current) {
          const { object:{ rotation:{x,y,z} } } = transform.current?.children[0] as unknown as {object:{rotation:{x:number,y:number,z:number}}}
          const {x:cx,y:cy,z:cz} = modelRef.current.rotation
          modelRef.current.updateMatrix()
          modelRef.current.rotation.set(cx-x,cy-y,cz-z)
          setNeedsUpdate(true)
          modelRef.current.updateMatrix()
          setLoading(false)
          setSolid(true)
          setPopups(null)
        }
      }
    ).catch(
      error => {
        console.log(error)
        setLoading(false)
        setPopups(null)
      }
    );
  }
}