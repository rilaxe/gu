export type Menu = {
    name: string, 
    dir: string,
    iconClass: string, 
    active: boolean,
    expandable: boolean,
    submenu: { name: string, url: string }[]
  }