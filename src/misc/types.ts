export const defaultPosition:ViewportProps = {
  x:5, y:5, z:5,
  tx:0, ty:0, tz:0,
  zoom: 1
}

export type ViewportProps = {
  x:number, y:number, z:number,
  tx:number, ty:number, tz:number,
  zoom: number, timestamp?: Date
}
