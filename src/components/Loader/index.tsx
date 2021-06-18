import { ButtonPannel, ModelView } from "components"
import { atoms } from "misc"
import { useRecoilState } from "recoil"
import { CircularProgress } from '@material-ui/core'
export function Loader() {

  return <div style={{
    position: 'absolute',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    bottom:0,top:0,left:0,right:0,
    backgroundColor:'rgba(0,0,0,0.4)',
    opacity: 1,
    pointerEvents:'none'
  }}>
    <CircularProgress/>
  </div>
}