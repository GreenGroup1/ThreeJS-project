import { Fragment, useRef } from "react"
import { ButtonPannel, ModelView } from "components"
import { BufferGeometry, Object3D } from "three"

export const MainScreen = () => {
  const geometryRef = useRef<BufferGeometry|undefined>()
  const modelRef = useRef<Object3D|undefined>()

  return (
    <Fragment>
      <ModelView {...{geometryRef, modelRef}} />
      <ButtonPannel {...{geometryRef, modelRef}}  />
    </Fragment>
  )
}
