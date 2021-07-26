import s from './style.module.scss'
import { atoms } from "misc"
import { Button, FormControlLabel, Checkbox, Typography } from "@material-ui/core"
import { useRecoilState } from "recoil"
import { useContext, useState } from 'react'
import { solidify } from 'functions'
import { ModelContext } from 'context'


export function SolidifyPopup () {
  const [ autoAlign, setAlign ] = useState(true)

  const [ model ] = useRecoilState(atoms.model)
  const { geometryRef, modelRef, transform } = useContext(ModelContext)
  const [ loading ] = useRecoilState(atoms.loading)

  const [ , setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ , setLoading ] = useRecoilState(atoms.loading)
  const [ , setTransformable ] = useRecoilState(atoms.transformable)
  const [ , setPopups ] = useRecoilState(atoms.popups)
  const [ , setSolid ] = useRecoilState(atoms.isSolid)

  return <div className={s.container}>
    <div className={s.menu}>
      <Typography variant="h6" style={{marginTop:'0.25rem'}}>
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
        <div className={s.b_row}>
          <Button onClick={()=>{setPopups(null)}} variant="outlined" className={s.button}>
            Cancel
          </Button>
          <Button onClick={()=>solidify({model,modelRef,geometryRef,transform,setTransformable,setLoading,setNeedsUpdate,setSolid,setPopups})} variant="outlined" className={s.button}>
            Solidify
          </Button>
        </div>
        </>}
      </div>
  </div>
}