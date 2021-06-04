import { Fragment, useRef } from "react"
import { ButtonPannel, ModelView } from "components"
import { BufferGeometry } from "three"

export const MainScreen = () => {
  const modelRef = useRef<BufferGeometry|undefined>()

  return (
    <Fragment>
      <ModelView {...{modelRef}} />
      <ButtonPannel {...{modelRef}}  />
    </Fragment>
  )
}
