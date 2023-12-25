export function textSlicer (txt : string, limit : number = 50) {
    if (txt.length > limit) {
        return txt.slice(0, limit) + "..."
    }
    return txt
}
export function numberWithCommas(x: string): string {
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  