import { atoms, auth } from "misc"
import { useRecoilState } from 'recoil'
import { useContext } from 'react'
import { ModelContext } from 'context'
import { Button as ButtonRegular, Divider, ButtonProps, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ReactComponent as Base } from 'assets/icons/base.svg'
import { ReactComponent as Rotate } from 'assets/icons/rotate.svg'
import { ReactComponent as ZoomIn } from 'assets/icons/zoom_in.svg'
import { ReactComponent as ZoomOut } from 'assets/icons/zoom_out.svg'
import { Vector3 as V3, DoubleSide, Event, Plane, FontLoader, BufferGeometry, BufferAttribute, Mesh, Material  } from 'three'

import { 
  GetApp as Import, 
  TextFields as Emboss, 
  Publish as Export, 
  ZoomOutMap as Arrows, 
  PhotoSizeSelectSmall as Scale, 
  Undo, Redo, Replay, 
  Public as World,  
  AllOut as Local, 
  ExitToApp, Edit } from '@material-ui/icons'
import { importModel, exportModel } from 'functions'

const useStyles = makeStyles(()=>({
  button: {
    width: '5rem',
    height: '3rem'
  }
}))


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

  const [ model, setModel ] = useRecoilState(atoms.model)
  const [ coordinate, setCoordinate ] = useRecoilState(atoms.transformCoordinate)
  const [ loading, setLoading ] = useRecoilState(atoms.loading)
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)
  const [ deletionMode, setDeletionMode ] = useRecoilState(atoms.deletionMode)
  const [ user ] = useRecoilState(atoms.user)
  const [ isSolid, setSolid ] = useRecoilState(atoms.isSolid)
  const [ selected, setSelected ] = useRecoilState(atoms.selected)
  const [ state, setState ] = useRecoilState(atoms.state)

  const { geometryRef, modelRef, textRef } = useContext(ModelContext)

  const [ , setMode ] = useRecoilState(atoms.transformMode)
  const [ , setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ , setPopup ] = useRecoilState(atoms.popups)

  return <div style={{position:'absolute', top:0,bottom:0,overflowY:'scroll', minWidth:'4rem'}}>
      <div style={{
        position:'absolute', 
        top:0,
        padding: '0.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'space-between',
        backgroundColor:'#24242c',
        minHeight:'calc(100% - 0.5rem)'
      }}>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <Button title='Import' disabled={loading} onClick={()=>importModel({geometryRef,setTransformable,setModel,setNeedsUpdate,setState})}>
            <Import style={{color:'#23ABD5'}}/>
          </Button>
          
          <Button onClick={()=>exportModel({modelRef,setTransformable})} disabled={loading} title='Export' >
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
          
          <Button title='Scale' disabled={loading||selected==='model'} onClick={()=>{
            setMode('scale')
          }}>
            <Scale style={{color:'#23ABD5'}}/>
          </Button> 
         

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
            `} onClick={()=>{
            if(model && modelRef.current){
              setDeletionMode(!deletionMode)
            }
          }} disabled={loading||isSolid}>
            <Edit style={{color: deletionMode?'#ffffff':'#23ABD5'}}/>
          </Button>

          <Button title='Solidify' disabled={loading||isSolid}  onClick={()=>setPopup('solidify')}>
            <Base/>
          </Button>

          <Button onClick={()=>setPopup('emboss')} disabled={loading||!isSolid} title='Emboss'  >
            <Emboss fontSize="small" style={{color:'#23ABD5'}}/>
          </Button>

          <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>

          <Button onClick={()=>{
            if(geometryRef?.current?.index?.array){
              console.log('undo')
              geometryRef.current.index.array = state[state.findIndex(v=>v.current)-1].buffer
              setNeedsUpdate(true)
            }
          }} disabled={loading||state.length<2||state.findIndex(v=>v.current)===0} title='Undo' >
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
            setSolid(false)
            setNeedsUpdate(true)
            setLoading(false)
          }} title='Start over' >
            <Replay fontSize="small" style={{color:'#23ABD5'}}/>
          </Button>

          <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/>
          
          {/* <Button title='Zoom In'  onClick={()=>{console.log('zoom in'); setNextZoom(zoom*2)}}>
            <ZoomIn/>
          </Button>

          <Button title='Zoom Out'  onClick={()=>{console.log('zoom out'); setNextZoom(zoom*0.5)}}>
            <ZoomOut/>
          </Button>
          <Divider style={{backgroundColor:'rgba(0,0,0,0.8)'}}/> */}

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
