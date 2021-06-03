import fileDialog from 'file-dialog'
import { Button, ButtonBorderType, ButtonType } from "./Button"
import { store } from "../App"
import { useState } from "@hookstate/core"
import { STLLoader } from "three-stdlib"

export const ButtonPannel = () => {
    const { observableModel } = useState(store)
    return <div style={{position:'absolute'}}>
        <Button inline onClick={async () => {
            const test = await fileDialog()
            const buffer = await test[0].arrayBuffer()
            console.log(test[0].name)
            const geometry = new STLLoader().parse(buffer)
            console.log(geometry)
            observableModel.set(geometry)
        }} roundedTopLeft type={ButtonType.IMPORT} down={ButtonBorderType.LIGHT} right={ButtonBorderType.LIGHT} />
        <Button inline type={ButtonType.POSITION} left={ButtonBorderType.DARK} right={ButtonBorderType.LIGHT} />
        <Button inline type={ButtonType.ROTATE} left={ButtonBorderType.DARK} right={ButtonBorderType.LIGHT} />
        <Button inline type={ButtonType.ZOOMIN} left={ButtonBorderType.DARK} right={ButtonBorderType.LIGHT} />
        <Button inline roundedTopRight roundedBottomRight type={ButtonType.ZOOMOUT} left={ButtonBorderType.DARK} />
        <Button type={ButtonType.BASE} />
        <Button type={ButtonType.EMBOSS} />
        <Button type={ButtonType.EXPORT} />
        <Button roundedBottomLeft roundedBottomRight type={ButtonType.STARTOVER} />
    </div>
}
