import fileDialog from 'file-dialog'
import { Button, ButtonBorderType, ButtonType } from "./Button"
import { atoms } from "misc"
import { STLLoader } from "three-stdlib"
import { MutableRefObject, useContext } from 'react'
import { useRecoilState } from 'recoil'
import { BufferGeometry } from 'three'

export const ButtonPannel = ({modelRef}:{modelRef:MutableRefObject<BufferGeometry|undefined>}) => {
    
  const [ model, setModel ] = useRecoilState(atoms.model)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)

    return <div style={{position:'absolute', pointerEvents:'none'}}>
        <Button inline onClick={async () => {
            const dialog = await fileDialog()
            const buffer = await dialog[0].arrayBuffer()
            const geometry = new STLLoader().parse(buffer)
            modelRef.current=geometry
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
        <Button inline type={ButtonType.ZOOMIN} left={ButtonBorderType.DARK} right={ButtonBorderType.LIGHT} />
        <Button inline roundedTopRight roundedBottomRight type={ButtonType.ZOOMOUT} left={ButtonBorderType.DARK} />
        <Button type={ButtonType.BASE} />
        <Button type={ButtonType.EMBOSS} />
        <Button type={ButtonType.EXPORT} />
        <Button roundedBottomLeft roundedBottomRight type={ButtonType.STARTOVER} />
    </div>
}
