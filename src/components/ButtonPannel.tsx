import fileDialog from 'file-dialog'
import { Button, ButtonBorderType, ButtonType } from "./Button"
import { atoms } from "misc"
import { STLLoader, mergeVertices } from "three-stdlib"
import { MutableRefObject, useContext } from 'react'
import { useRecoilState } from 'recoil'
import { BufferGeometry, Object3D } from 'three'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'

type ButtonsProps = {
  geometryRef:MutableRefObject<BufferGeometry|undefined>,
  modelRef:MutableRefObject<Object3D|undefined>
}

export const ButtonPannel = ({geometryRef, modelRef}:ButtonsProps) => {
    
  const [ model, setModel ] = useRecoilState(atoms.model)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)
  const [ zoom, setZoom ] = useRecoilState(atoms.zoom)
  const [ nextZoom, setNextZoom ] = useRecoilState(atoms.nextZoom)

    return <div style={{position:'absolute', pointerEvents:'none'}}>
        <Button inline onClick={async () => {
            const dialog = await fileDialog()
            const buffer = await dialog[0].arrayBuffer()
            const geometry = new STLLoader().parse(buffer)
            const merged = mergeVertices(geometry, 0.05)
            geometryRef.current= merged
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
            const stlFormatted = exporter.parse(modelRef.current)
            console.log(stlFormatted)
            const formData  = new FormData();
            formData.append('model.stl', stlFormatted)
            fetch('https://edit.dentalmodelmaker.com/', { // Your POST endpoint
              method: 'POST',
              headers: {
                "Content-Type": "multipart/form-data"
              },
              body: formData // This is your file object
            }).then(
              response => response.text()
            ).then(
              success => console.log('loaded modified', success) // Handle the success response object
            ).catch(
              error => console.log(error) // Handle the error response object
            );
          }
        }} type={ButtonType.BASE} />
        <Button type={ButtonType.EMBOSS} />
        <Button type={ButtonType.EXPORT} />
        <Button roundedBottomLeft roundedBottomRight type={ButtonType.STARTOVER} />
    </div>
}
