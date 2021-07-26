import { Mesh, BufferGeometry, Material, Camera } from 'three'
import { gzip } from 'pako'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { v4 as uuid} from 'uuid'
import { STLLoader, TransformControls } from "three-stdlib"

type embossParams = {
  modelRef: React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]> | undefined>
  geometryRef: React.MutableRefObject<BufferGeometry | undefined>
  textRef: React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]> | undefined>
  transform: React.MutableRefObject<TransformControls<Camera> | null>
  setTransformable: (p:boolean)=>void
  setLoading: (p:boolean)=>void
  setNeedsUpdate: (p:boolean)=>void,
  setPopups: (p:'emboss'|'solidify'|null)=>void
  setText: (p:string)=>void
}

export function emboss ({
  modelRef,
  geometryRef,
  textRef,
  transform,
  setTransformable,
  setLoading,
  setNeedsUpdate,
  setPopups,
  setText
}:embossParams){
  setTransformable(false)
  if(modelRef.current && textRef.current){
    console.log(modelRef.current,textRef.current)
    setTransformable(false)
    setLoading(true)
    const exporter = new STLExporter()
    const stlFormatted = exporter.parse(modelRef.current, {binary:true}) as unknown as DataView
    const uint8View = new Uint8Array(stlFormatted.buffer);
    const compressed = gzip(uint8View)
    const compressedFile = compressed.buffer
    const file = new File([compressedFile],`${uuid()}.stl`, {type: "model/stl"})   

    const stlFormattedText = exporter.parse(textRef.current, {binary:true}) as unknown as DataView
    const uint8ViewText = new Uint8Array(stlFormattedText.buffer);
    const compressedText = gzip(uint8ViewText)
    const compressedFileText = compressedText.buffer
    const fileText = new File([compressedFileText],`${uuid()}.stl`, {type: "model/stl"})   

    const formData  = new FormData()     
    formData.append('file', file, `${uuid()}.stl`)
    formData.append('text', fileText, `${uuid()}.stl`)

    fetch(origin==='http://localhost:3000'?'http://127.0.0.1:5005/emboss/':'https://edit.dentalmodelmaker.com/emboss/', { 
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
          setPopups(null)
          setText('')
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