export const defaultPosition:ViewportProps = {
  x:50, y:50, z:50,
  tx:0, ty:0, tz:0,
  zoom: 1
}

export type ViewportProps = {
  x:number, y:number, z:number,
  tx:number, ty:number, tz:number,
  zoom: number, timestamp?: Date
}
