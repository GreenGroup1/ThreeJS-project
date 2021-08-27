import s from './style.module.scss'
import { atoms } from "misc"
import { Button, TextField, Typography } from "@material-ui/core"
import { useRecoilState } from "recoil"
import { useContext, useEffect, useState } from 'react'
import { emboss } from 'functions'
import { ModelContext } from 'context'

export function EmbossPopup () {
  const [ text, setText ] = useRecoilState(atoms.text)

  const { geometryRef, modelRef, transform, textRef } = useContext(ModelContext)

  const [ , setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ , setLoading ] = useRecoilState(atoms.loading)
  const [ , setTransformable ] = useRecoilState(atoms.transformable)
  const [ , setPopups ] = useRecoilState(atoms.popups)
  const [ loading ] = useRecoilState(atoms.loading)
  const [ progress, setProgress ] = useState(0)

  useEffect(()=>{
    const timerId = setInterval( getProgress, 1000 )
    function getProgress(){
      const p = (loading!==null&&loading!==false) ? Number(( 99 * ((new Date()).getTime() - loading.getTime() )/900000 ).toFixed(0)) : (loading===false?100: 0)
      setProgress(p)
      if(p===99){
        clearInterval(timerId)
      }      
    }
    return ()=>{clearInterval(timerId); setProgress(0)}
  },[loading, setProgress])

  return (
    <div style={{ position:'absolute', top:0, bottom:0, left:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ backgroundColor:'white', width: 420, borderRadius:'0.2rem', boxShadow:'-2px 2px 2px rgba(0,0,0,0.2)', boxSizing:'border-box' }}>
        <div style={{display:'flex', padding:'1.5rem 2rem', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="h6" >
            Emboss
          </Typography>
          <Typography onClick={()=>{setPopups(null); setLoading(null)}} variant="subtitle2" component='a' style={{textDecoration: 'underline', cursor:'pointer'}}>
            Close
          </Typography>
        </div>
        <hr style={{border:'none', margin:'0', padding:'0', borderBottom:'solid 0.5px rgba(0,0,0,0.2)' }}/>
        
        {((!!loading) || loading===false )?
          <div style={{padding:'2rem'}}>
            <Typography variant="body2" style={{marginTop:'0.25rem', fontWeight:'bold', textAlign: 'center'}}>
              {progress===100? 'Completed!': 'Loading...'}
            </Typography>
            <Typography variant="body2" style={{marginTop:'1rem', textAlign: 'center'}}>
              {progress===100? 'Your 3D model is ready' : '3D model is being prepared. Please be patient.'}
            </Typography>

            <div style={{width:'100%', backgroundColor: '#E5E5E5', display: 'flex', borderRadius:'0.5rem', marginTop:'2rem'}}>
              <div style={{width:'5rem', height:'100%', minHeight: '4rem', borderRadius:'0.5rem', color:'white', backgroundColor: progress===100?'#23D555':'#23abd5', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                <Typography variant="h6">
                  {progress}%
                </Typography>
              </div>
              <div style={{width: `calc( 100% - 5rem )`, flex: '1 1 auto', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                <div style={{ backgroundColor:'white', height:'0.5rem', width:'100%', borderRadius:'0.25rem' }}>
                  <div style={{ backgroundColor: progress===100?'#23D555':'#23abd5', height:'0.5rem', width:`${progress}%`, borderRadius:'0.25rem' }}/>
                </div>
              </div>
            </div>
          </div>:

          <div style={{padding:'2rem'}}>
            <Typography variant="body1" style={{textAlign:'left', fontWeight: 'bold'}}>
              Emboss  text*
            </Typography>
            <TextField 
              required 
              value={text} 
              onChange={(e)=>setText(e.target.value)} 
              id="emboss" 
              label="Emboss text" 
              variant="filled" 
              style={{width:'100%', marginTop:'1rem'}} 
            />
            <Typography variant="body1" style={{textAlign:'left',  marginTop:'1rem'}}>
              Then, click "Save & Close" to adjust the position, scale and rotation of the text, 
              or "Apply" if you already aligned text with the model and ready to merge them.
            </Typography>
            <div style={{width:'100%'}}>
              <Button 
                onClick={()=>setPopups(null)} 
                style={{width:'100%', height:'3.2rem', marginTop:'1rem', color:'white', backgroundColor: '#393942'}}>
                  Save & Close
              </Button>

              <Button 
                onClick={()=>{
                  emboss({modelRef,geometryRef,textRef,transform,setTransformable,setLoading,setNeedsUpdate,setPopups,setText})
                }} 
                style={{width:'100%', height:'3.2rem', marginTop:'1rem', color:'white', backgroundColor: '#23abd5'}}>
                  Apply
              </Button>
            </div>
          </div>
        }
      </div>
    </div>)
}