import fileDialog from 'file-dialog'
import { atoms } from "misc"
import { STLLoader } from "three-stdlib"
import { useRecoilState } from 'recoil'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { v4 as uuid} from 'uuid'
import { useContext } from 'react'
import { ModelContext } from 'context'
import { IconButton, Button as ButtonRegular, makeStyles, Divider } from '@material-ui/core'

import { ReactComponent as Base } from 'assets/icons/base.svg'
import { ReactComponent as EmbossOld } from 'assets/icons/emboss.svg'
import { ReactComponent as ExportOld } from 'assets/icons/export.svg'
import { ReactComponent as ImportOld } from 'assets/icons/import.svg'
import { ReactComponent as TranslateOld } from 'assets/icons/position.svg'
import { ReactComponent as Rotate } from 'assets/icons/rotate.svg'
import { ReactComponent as Reset } from 'assets/icons/start_over.svg'
import { ReactComponent as ZoomIn } from 'assets/icons/zoom_in.svg'
import { ReactComponent as ZoomOut } from 'assets/icons/zoom_out.svg'
import { 
  GetApp as Import, 
  TextFields as Emboss, 
  Publish as Export, 
  ZoomOutMap as Arrows, 
  PhotoSizeSelectSmall as Scale, 
  Undo, Redo, Replay, 
  Public as World,  
  AllOut as Local } from '@material-ui/icons'

const useStyles = makeStyles(()=>({
  button: {
    width: '5rem',
    height: '3rem'
  }
}))

function Button(props:any){
  const classes = useStyles()

  return <ButtonRegular 
    variant="contained" 
    color='secondary'
    style={{ 
      borderRadius: 0,
      margin: '0.5rem', 
      width:'2.5rem', 
      height:'2.5rem', 
      display:'flex', 
      padding:0}} 
    size='small' {...props}>
      {props.children}
  </ButtonRegular>
}

export function ButtonPannel() {
  const classes = useStyles()
  const [ model, setModel ] = useRecoilState(atoms.model)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)
  const [ coordinate, setCoordinate ] = useRecoilState(atoms.transformCoordinate)
  const [ zoom, setZoom ] = useRecoilState(atoms.zoom)
  const [ nextZoom, setNextZoom ] = useRecoilState(atoms.nextZoom)
  const { geometryRef, modelRef, transform, orbit } = useContext(ModelContext)
  const [,setViewport] = useRecoilState(atoms.viewport)
  const [ needsUpdate, setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ loading, setLoading ] = useRecoilState(atoms.loading)
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)

    return <div style={{
      position:'absolute', 
      top:0,
      padding: '0.25rem',
      // border: 'solid rgba(0,0,0,0.2) 1px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor:'#24242c'
    }}>
        
        <Button title='Import' onClick={async () => {
            setTransformable(false)
            const dialog = await fileDialog()
            const buffer = await dialog[0].arrayBuffer()
            const geometry = new STLLoader().parse(buffer)
            // const merged = mergeVertices(geometry, 0.05)
            geometryRef.current= geometry
            setModel(dialog[0].name)
            setNeedsUpdate(true)
            console.log(dialog[0].name)
            console.log(geometry)
        }}>
          <Import style={{color:'#23ABD5'}}/>
        </Button>
        
        <Button onClick={()=>setTransformable(false)} title='Export' >
          <Export style={{color:'#23ABD5'}}/>
        </Button>

        <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

        <Button title='Translate' onClick={()=>{
          setMode('translate')
        }}>
          <Arrows fontSize='small' style={{color:'#23ABD5', transform:'rotate(45deg)'}}/>
        </Button>

        <Button title='Rotate'  onClick={()=>{
          setMode('rotate')
        }}>
          <Rotate/>
        </Button>

        <Button title='Scale'  onClick={()=>{
          setMode('scale')
        }}>
          <Scale style={{color:'#23ABD5'}}/>
        </Button>

        <Button title='Transformation coordinates'  onClick={()=>{
          if(!transformable) setTransformable(true)
          setCoordinate(prev=>prev==='world'?'local':'world')
        }}>
          {coordinate==='world'? 
            <World style={{color:'#23ABD5'}}/>:
            <Local style={{color:'#23ABD5'}}/>}
        </Button>

        <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

        <Button title='Solidify'  onClick={()=>{
          if(model && modelRef.current){
            setTransformable(false)
            setLoading(true)
            const exporter = new STLExporter()
            const stlFormatted = exporter.parse(modelRef.current, {binary:true})
            console.log(stlFormatted, origin)
            const file = new File([stlFormatted],`${uuid()}.stl`, {type: "model/stl"})    
            const formData  = new FormData()     
            formData.append('file', file, `${uuid()}.stl`)
            fetch(origin==='http://localhost:3000'?'http://localhost:5000/':'https://edit.dentalmodelmaker.com/', { 
              method: 'POST',
              body: formData,
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
                }
              }
            ).catch(
              error => {
                console.log(error)
                setLoading(false)
              }
            );
          }
        }}>
          <Base/>
        </Button>

        <Button onClick={()=>setTransformable(false)} title='Emboss'  >
          <Emboss fontSize="small" style={{color:'#23ABD5'}}/>
        </Button>

        <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

        <Button onClick={()=>setTransformable(false)} title='Undo' >
          <Undo fontSize="small" style={{color:'#23ABD5'}}/>
        </Button>

        <Button onClick={()=>setTransformable(false)} title='Redo' >
          <Redo fontSize="small" style={{color:'#23ABD5'}}/>
        </Button>

        <Button onClick={()=>{
          setTransformable(false)
          modelRef.current=undefined
          geometryRef.current=undefined
          setNeedsUpdate(true)
          setLoading(false)
        }} title='Start over' >
          <Replay fontSize="small" style={{color:'#23ABD5'}}/>
        </Button>

        <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>
        
        <Button title='Zoom In'  onClick={()=>{console.log('zoom in'); setNextZoom(zoom*2)}}>
         <ZoomIn/>
        </Button>

        <Button title='Zoom Out'  onClick={()=>{console.log('zoom out'); setNextZoom(zoom*0.5)}}>
          <ZoomOut/>
        </Button>

    </div>
}
