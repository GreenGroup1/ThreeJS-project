import s from './style.module.scss'
import { atoms } from "misc"
import { Button, TextField, Typography } from "@material-ui/core"
import { useRecoilState } from "recoil"
import { useContext, useEffect, useState } from 'react'
import { emboss, exportModel } from 'functions'
import { ModelContext } from 'context'

export function ExportPopup () {
  const [ name, setName ] = useState('')

  const { modelRef } = useContext(ModelContext)

  const [ , setTransformable ] = useRecoilState(atoms.transformable)
  const [ , setPopups ] = useRecoilState(atoms.popups)

  return (
    <div style={{ position:'absolute', top:0, bottom:0, left:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ backgroundColor:'white', width: 420, borderRadius:'0.2rem', boxShadow:'-2px 2px 2px rgba(0,0,0,0.2)', boxSizing:'border-box' }}>
        <div style={{display:'flex', padding:'1.5rem 2rem', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="h6">
            Export File
          </Typography>
          <Typography onClick={()=>{setPopups(null);}} variant="subtitle2" component='a' style={{textDecoration: 'underline', cursor:'pointer'}}>
            Close
          </Typography>
        </div>
        <hr style={{border:'none', margin:'0', padding:'0', borderBottom:'solid 0.5px rgba(0,0,0,0.2)' }}/>

          <div style={{padding:'2rem'}}>
            <Typography variant="body1" style={{textAlign:'left', fontWeight: 'bold'}}>
              File name*
            </Typography>
            <TextField 
              required 
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
              id="emboss" 
              label="File name*" 
              variant="filled" 
              style={{width:'100%', marginTop:'1rem'}} 
            />
            <Typography variant="body1" style={{textAlign:'left',  marginTop:'1rem'}}>
              After you enter the  name of the file, click on the "Export File" to save  it to the computer.
            </Typography>
            <div style={{width:'100%'}}>

              <Button 
                onClick={()=>exportModel({modelRef,setTransformable,name})}
                style={{width:'100%', height:'3.2rem', marginTop:'1rem', color:'white', backgroundColor: '#23abd5'}}>
                  Export File
              </Button>
            </div>
          </div>
      </div>
    </div>)
}