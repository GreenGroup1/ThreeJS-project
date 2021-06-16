import fileDialog from 'file-dialog'
import { Button, ButtonBorderType, ButtonType } from "./Button"
import { atoms } from "misc"
import { STLLoader } from "three-stdlib"
import { useRecoilState } from 'recoil'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { v4 as uuid} from 'uuid'
import { useContext } from 'react'
import { ModelContext } from 'context'

export const ButtonPannel = () => {
    
  const [ model, setModel ] = useRecoilState(atoms.model)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)
  const [ zoom, setZoom ] = useRecoilState(atoms.zoom)
  const [ nextZoom, setNextZoom ] = useRecoilState(atoms.nextZoom)
  const { geometryRef, modelRef, transform, orbit } = useContext(ModelContext)
  const [,setViewport] = useRecoilState(atoms.viewport)
  const [ needsUpdate, setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)

    return <div style={{position:'absolute', pointerEvents:'none'}}>
        <Button inline onClick={async () => {
            const dialog = await fileDialog()
            const buffer = await dialog[0].arrayBuffer()
            const geometry = new STLLoader().parse(buffer)
            // const merged = mergeVertices(geometry, 0.05)
            geometryRef.current= geometry
            setModel(dialog[0].name)
            console.log(dialog[0].name)
            console.log(geometry)
        }} roundedTopLeft type={ButtonType.IMPORT} down={ButtonBorderType.LIGHT} right={ButtonBorderType.LIGHT} />
        <Button onClick={()=>{
          setMode('translate')
        }}
          inline type={ButtonType.POSITION} left={ButtonBorderType.DARK} right={ButtonBorderType.LIGHT} />
        <Button onClick={()=>{
          setMode('rotate')
        }} inline type={ButtonType.ROTATE} left={ButtonBorderType.DARK} right={ButtonBorderType.LIGHT} />
        <Button onClick={()=>{console.log('zoom in'); setNextZoom(zoom*2)}} inline type={ButtonType.ZOOMIN} left={ButtonBorderType.DARK} right={ButtonBorderType.LIGHT} />
        <Button onClick={()=>{console.log('zoom out'); setNextZoom(zoom*0.5)}} inline roundedTopRight roundedBottomRight type={ButtonType.ZOOMOUT} left={ButtonBorderType.DARK} />
        <Button onClick={()=>{
          if(model && modelRef.current){
            const exporter = new STLExporter()
            const stlFormatted = exporter.parse(modelRef.current, {binary:true})
            console.log(stlFormatted)
            const file = new File([stlFormatted],`${uuid()}.stl`, {type: "model/stl"})    
            const formData  = new FormData()     
            formData.append('file', file, `${uuid()}.stl`)
            fetch('https://edit.dentalmodelmaker.com/', { 
              method: 'POST',
              body: formData,
            }).then(
              response => response.arrayBuffer()
            ).then(
              success => {
                const geometry = new STLLoader().parse(success)
                geometryRef.current=geometry    
                setNeedsUpdate(true)
              }
            ).catch(
              error => console.log(error)
            );
            

          }
        }} type={ButtonType.BASE} />
        <Button type={ButtonType.EMBOSS} />
        <Button type={ButtonType.EXPORT} />
        <Button roundedBottomLeft roundedBottomRight type={ButtonType.STARTOVER} />
    </div>
}
