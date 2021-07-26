import s from './style.module.scss'
import { atoms } from "misc"
import { Button, TextField, Typography } from "@material-ui/core"
import { useRecoilState } from "recoil"
import { useContext, useState } from 'react'
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

  return <div className={s.container}>
    <div className={s.menu}>
      <Typography variant="h6" style={{marginTop:'0.25rem'}}>
        {loading?'Loading...':'Please enter emboss text'}
      </Typography>
      {loading && <>
        <TextField 
          value={text} 
          onChange={(e)=>setText(e.target.value)} 
          id="emboss" 
          label="Emboss text" 
          variant="outlined" 
          style={{margin:'0.5rem 0', width:'100%'}} 
          InputProps={{style:{maxHeight:'3rem'}}}
        />
        <Typography variant="body1" style={{textAlign:'center'}}>
          Then, click "Save & Close" to adjust the position, scale and rotation of the text, 
          or "Apply" if you already aligned text with the model and ready to merge them.
        </Typography>
        <div className={s.b_row}>
          <Button onClick={()=>setPopups(null)} variant="outlined" className={s.button}>
            Save & Close
          </Button>
          <Button onClick={()=>{
            emboss({modelRef,geometryRef,textRef,transform,setTransformable,setLoading,setNeedsUpdate,setPopups,setText})
          }} variant="outlined" className={s.button}>
            Apply
          </Button>
      </div>
      </>}
    </div>
  </div>
}