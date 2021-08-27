import s from './style.module.scss'
import { atoms } from "misc"
import { Alert, Button, Checkbox, FormControlLabel, Snackbar, Typography } from "@material-ui/core"
import { useRecoilState } from "recoil"
import { useContext, useEffect, useState } from 'react'
import { solidify } from 'functions'
import { ModelContext } from 'context'
import { useHistory } from 'react-router-dom'


export function SolidifyPopup () {
  const [ autoAlign, setAlign ] = useState(true)
  const [error, setError] = useState<any>()

  const [ model ] = useRecoilState(atoms.model)
  const { geometryRef, modelRef, transform } = useContext(ModelContext)
  const  history = useHistory()
  
  const [ loading, setLoading ] = useRecoilState(atoms.loading)
  const [ progress, setProgress ] = useState(0)

  const [ , setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ , setTransformable ] = useRecoilState(atoms.transformable)
  const [ , setPopups ] = useRecoilState(atoms.popups)
  const [ , setSolid ] = useRecoilState(atoms.isSolid)

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
            Solidify
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
          <Typography variant="body2" style={{marginTop:'0.25rem'}}>
            Please choose options to solidify model
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={autoAlign}
                onChange={()=>setAlign(!autoAlign)}
                name="Auto-align"
                color="primary"
              />
            }
            label="Auto-align"
          />
          <div style={{width:'100%'}}>
            <Button 
              onClick={()=>solidify({model,modelRef,geometryRef,transform,setTransformable,setLoading,setNeedsUpdate,setSolid,setPopups})}
              style={{width:'100%', height:'3.2rem', marginTop:'1rem', color:'white', backgroundColor: '#23abd5'}}>
              Solidify
            </Button>

            <Button 
                onClick={()=>{setPopups(null)}}
              variant='outlined'
              style={{width:'100%', height:'3.2rem', marginTop:'1rem', color:'#23abd5', backgroundColor: '#fff'}}>
              <Typography variant='body2' style={{marginLeft:'0.5rem'}}>
                Cancel
              </Typography>
            </Button>
          </div>
        </div>
        }
      </div>
      <Snackbar open={error} autoHideDuration={6000} onClose={()=>setError(undefined)}>
        <Alert onClose={()=>setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error?.message||JSON.stringify(error)}
        </Alert>
      </Snackbar>
    </div>
  )
}