export enum ButtonType {
    IMPORT = 'import',
    POSITION = 'position',
    ROTATE = 'rotate',
    ZOOMIN = 'zoom in',
    ZOOMOUT = 'zoom out',
    BASE = 'base',
    EMBOSS = 'emboss',
    EXPORT = 'export',
    STARTOVER = 'start over',
}

export enum ButtonBorderType {
    LIGHT = '#52515f',
    DARK = '#363541',
}

interface IButtonProps {
    inline?: boolean
    type: ButtonType
    left?: ButtonBorderType
    right?: ButtonBorderType
    up?: ButtonBorderType
    down?: ButtonBorderType
    roundedTopRight?: boolean
    roundedTopLeft?: boolean
    roundedBottomRight?: boolean
    roundedBottomLeft?: boolean
    onClick?: () => void
}

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

const borders = ({ left, right, up, down }: IButtonProps) => ({
    borderLeft: left ? `1px solid ${left}` : '',
    borderRight: right ? `1px solid ${right}` : '',
    borderTop: up ? `1px solid ${up}` : '',
    borderBottom: down ? `1px solid ${down}` : '',
})

const roundedCorners = ({ roundedTopRight, roundedTopLeft, roundedBottomRight, roundedBottomLeft }: IButtonProps) => ({
    borderTopRightRadius: roundedTopRight ? '10px' : '',
    borderTopLeftRadius: roundedTopLeft ? '10px' : '',
    borderBottomRightRadius: roundedBottomRight ? '10px' : '',
    borderBottomLeftRadius: roundedBottomLeft ? '10px' : '',
})

export const Button = (props: IButtonProps) => (
    <div onClick={props.onClick} style={{ ...borders(props), ...roundedCorners(props), display: props.inline ? 'inline-block' : '', height: '64px', width: '72px', backgroundColor: '#464554', alignItems: 'center', justifyContent: 'center', alignContent: 'center', pointerEvents:'all' }}>
        <img style={{ width: '40%', marginLeft: '20px', height:'28px',  marginTop:'10px' }} src={`/icons/${props.type}.svg`} alt='button' />
        <div style={{ fontSize:'10px', fontWeight:'bold', textAlign: 'center', color: '#B5B5C3' }} >{capitalize(props.type)}</div>
    </div>
)
