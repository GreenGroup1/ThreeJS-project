import { MainScreen } from "./screens/MainScreen"
import { createState } from '@hookstate/core'
import { BufferGeometry } from "three"

export interface ApplicationState {
  observableModel?: BufferGeometry | null
}

export const store = createState<ApplicationState>({
  observableModel: null
})

export const Application = () => {
  return (
    <MainScreen />
  )
}
