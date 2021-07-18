import fileDialog from 'file-dialog'
import { atoms, auth } from "misc"
import { BufferAttribute, BufferGeometry, BufferGeometryUtils, Float32BufferAttribute } from 'three'
import { STLLoader } from "three-stdlib"
import { useRecoilState } from 'recoil'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { v4 as uuid} from 'uuid'
import { useContext } from 'react'
import { ModelContext } from 'context'
import { Button as ButtonRegular, Divider, ButtonProps, ListItemAvatar, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ReactComponent as Base } from 'assets/icons/base.svg'
import { ReactComponent as Rotate } from 'assets/icons/rotate.svg'
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
  AllOut as Local, 
  ExitToApp, Edit,
  AccountCircle} from '@material-ui/icons'
import { CSG } from 'three-csg-ts'
import { deflate, gzip, deflateRaw } from 'pako'
import toIndexed from './toIndexed'

const useStyles = makeStyles(()=>({
  button: {
    width: '5rem',
    height: '3rem'
  }
}))

function download(file:File, filename:string) {
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else {
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}


function Button(props:ButtonProps<'button'>){
  const classes = useStyles()

  return <ButtonRegular 
    variant="contained" 
    color='secondary'
    size='small' 
    {...props}
    style={{ 
      ...props?.style||{},
      borderRadius: 0,
      margin: '0.5rem', 
      width:'2.5rem', 
      height:'2.5rem', 
      display:'flex', 
      padding:0}} >
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
  const { geometryRef, modelRef, transform, orbit, textRef } = useContext(ModelContext)
  const [ ,setViewport] = useRecoilState(atoms.viewport)
  const [ needsUpdate, setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ loading, setLoading ] = useRecoilState(atoms.loading)
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)
  const [ text, setText ] = useRecoilState(atoms.text)
  const [ user, setUser ] = useRecoilState(atoms.user)
  const [ deletionMode, setDeletionMode ] = useRecoilState(atoms.deletionMode)

  return <div style={{position:'absolute', top:0,bottom:0,overflowY:'scroll', minWidth:'4rem'}}>
      <div style={{
        position:'absolute', 
        top:0,
        padding: '0.25rem',
        // border: 'solid rgba(0,0,0,0.2) 1px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'space-between',
        backgroundColor:'#24242c',
        minHeight:'calc(100% - 0.5rem)'
      }}>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <Button title='Import' disabled={loading} onClick={async () => {
              setTransformable(false)
              const dialog = await fileDialog()
              const buffer = await dialog[0].arrayBuffer()
              const bufferGeometry = new STLLoader().parse(buffer)
              // bufferGeometry.computeVertexNormals()
              // bufferGeometry.computeTangents()
              // bufferGeometry.computeBoundingBox()
              //@ts-ignore
              BufferGeometry.prototype.toIndexed = toIndexed
              
              //@ts-ignore
              const indexed = bufferGeometry.toIndexed()
              console.log(indexed)
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
          }}>
            <Import style={{color:'#23ABD5'}}/>
          </Button>
          
          <Button onClick={()=>{
            if(modelRef.current){
              setTransformable(false)
              const exporter = new STLExporter()
              const stlFormatted = exporter.parse(modelRef.current, {binary:true})
              console.log(stlFormatted, origin)
              const file = new File([stlFormatted],`${uuid()}.stl`, {type: "model/stl"})    
              console.log(new Date().toJSON().slice(0,10))
              download(file,`model.stl`)
            }
          }} disabled={loading} title='Export' >
            <Export style={{color:'#23ABD5'}}/>
          </Button>

          <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

          <Button title='Translate' disabled={loading} onClick={()=>{
            setMode('translate')
          }}>
            <Arrows fontSize='small' style={{color:'#23ABD5', transform:'rotate(45deg)'}}/>
          </Button>

          <Button title='Rotate' disabled={loading}  onClick={()=>{
            setMode('rotate')
          }}>
            <Rotate/>
          </Button>
          {/* 
          <Button title='Scale' disabled={loading} onClick={()=>{
            setMode('scale')
          }}>
            <Scale style={{color:'#23ABD5'}}/>
          </Button> 
          */}

          <Button title='Transformation coordinates' disabled={loading} onClick={()=>{
            if(!transformable) setTransformable(true)
            setCoordinate(prev=>prev==='world'?'local':'world')
          }}>
            {coordinate==='world'? 
              <World style={{color:'#23ABD5'}}/>:
              <Local style={{color:'#23ABD5'}}/>}
          </Button>

          <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

          <Button title={`
Delete faces by pressing keyboard button D 
and hovering over geometry with mouse
            `} disabled={loading} onClick={()=>{
            if(model && modelRef.current){
              setDeletionMode(!deletionMode)
            }
          }}>
            <Edit style={{color: deletionMode?'#ffffff':'#23ABD5'}}/>
          </Button>

          <Button title='Solidify' disabled={loading}  onClick={()=>{
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
              console.log(stlFormatted, formData, compressed)
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

          <Button onClick={()=>{
            setTransformable(false)
            if(modelRef.current && textRef.current){
              console.log(modelRef.current,textRef.current)
              modelRef.current.updateMatrix();
              textRef.current.updateMatrix();
              const bufferGeometry = modelRef.current.geometry
              bufferGeometry.computeVertexNormals()
              bufferGeometry.computeBoundingBox()
              const count = bufferGeometry.attributes.position.count
              const array = new Float32Array(count*2)
              new Array(count)
                .map((v,i)=>[i/(count+1), (i+1)/(count+1)])
                .flat()
                .forEach((v,i)=>{array[i]=v})

              bufferGeometry.setAttribute(
                'uv', 
                new BufferAttribute(array, 2)
              )

              //@ts-ignore
              const meshResult = CSG.union(modelRef.current, textRef.current)
              console.log(meshResult,modelRef.current, textRef.current)
              modelRef.current=meshResult
              modelRef.current.updateMatrix()
              setNeedsUpdate(true)

              setText('')
              textRef.current=undefined
            }
          }} disabled={loading} title='Emboss'  >
            <Emboss fontSize="small" style={{color:'#23ABD5'}}/>
          </Button>

          <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

          <Button onClick={()=>setTransformable(false)} disabled={loading} title='Undo' >
            <Undo fontSize="small" style={{color:'#23ABD5'}}/>
          </Button>

          <Button onClick={()=>setTransformable(false)} disabled={true} title='Redo' >
            <Redo fontSize="small" style={{color:'#23ABD5'}}/>
          </Button>

          <Button onClick={()=>{
            setTransformable(false)
            modelRef.current=undefined
            geometryRef.current=undefined
            textRef.current=undefined

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
          <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

        </div>
        <div>
            
          <Avatar style={{maxWidth:'2rem', maxHeight:'2rem', margin:'1rem auto 1rem auto',}} alt={user?.display_name||'User'} src={user?.avatar_url||''} >
            {(user?.display_name||'User').split(' ').map(l=>l.slice(0,1).toUpperCase()).join('')}
          </Avatar>
            
          <Button title='Log out'  onClick={()=>{auth.logout()}}>
            <ExitToApp/>
          </Button>
        </div>
    </div>
  </div>
}
