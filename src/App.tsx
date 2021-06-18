import { ButtonPannel, ModelView } from "components"
import { atoms } from "misc"
import { useRecoilState } from "recoil"
import { Loader } from 'components'

export default function App () {
  const [ loading, setLoading ] = useRecoilState(atoms.loading)

  return <>
      <ModelView />
      {loading && <Loader/>}
      <ButtonPannel />
  </>
}
