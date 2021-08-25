import s from './style.module.scss'
import { atoms } from "misc"
import { Alert, Button, Checkbox, FormControlLabel, Snackbar, Typography } from "@material-ui/core"
import { useRecoilState } from "recoil"
import { useContext, useState } from 'react'
import { solidify } from 'functions'
import { ModelContext } from 'context'
import { useHistory } from 'react-router-dom'


export function SolidifyPopup () {
  const [ autoAlign, setAlign ] = useState(true)
  const [error, setError] = useState<any>()

  const [ model ] = useRecoilState(atoms.model)
  const { geometryRef, modelRef, transform } = useContext(ModelContext)
  const [ loading ] = useRecoilState(atoms.loading)
  const  history = useHistory()

  const [ , setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ , setLoading ] = useRecoilState(atoms.loading)
  const [ , setTransformable ] = useRecoilState(atoms.transformable)
  const [ , setPopups ] = useRecoilState(atoms.popups)
  const [ , setSolid ] = useRecoilState(atoms.isSolid)

  return (
    <div style={{ position:'absolute', top:0, bottom:0, left:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ backgroundColor:'white', width: 420, borderRadius:'0.2rem', boxShadow:'-2px 2px 2px rgba(0,0,0,0.2)', boxSizing:'border-box' }}>
        <div style={{display:'flex', padding:'1.5rem 2rem', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="h6" >
            Solidify
          </Typography>
          <Typography onClick={()=>setPopups(null)} variant="subtitle2" component='a' style={{textDecoration: 'underline', cursor:'pointer'}}>
            Close
          </Typography>
        </div>
        <hr style={{border:'none', margin:'0', padding:'0', borderBottom:'solid 0.5px rgba(0,0,0,0.2)' }}/>
        
        <div style={{padding:'2rem'}}>
          
        <Typography variant="body2" style={{marginTop:'0.25rem'}}>
          {loading?'Loading...':'Please choose options to solidify model'}
        </Typography>
        {!loading &&<>
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
          </>}

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
      </div>
      <Snackbar open={error} autoHideDuration={6000} onClose={()=>setError(undefined)}>
        <Alert onClose={()=>setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error?.message||JSON.stringify(error)}
        </Alert>
      </Snackbar>
    </div>
  )

  // return <div className={s.container}>
  //   <div className={s.menu}>
  //     <Typography variant="h6" style={{marginTop:'0.25rem'}}>
  //       {loading?'Loading...':'Please choose options to solidify model'}
  //     </Typography>
  //     {!loading &&<>
  //       <FormControlLabel
  //         control={
  //           <Checkbox
  //             checked={autoAlign}
  //             onChange={()=>setAlign(!autoAlign)}
  //             name="Auto-align"
  //             color="primary"
  //           />
  //         }
  //         label="Auto-align"
  //       />
  //       <div className={s.b_row}>
  //         <Button onClick={()=>{setPopups(null)}} variant="outlined" className={s.button}>
  //           Cancel
  //         </Button>
  //         <Button onClick={()=>solidify({model,modelRef,geometryRef,transform,setTransformable,setLoading,setNeedsUpdate,setSolid,setPopups})} variant="outlined" className={s.button}>
  //           Solidify
  //         </Button>
  //       </div>
  //       </>}
  //     </div>
  // </div>
}