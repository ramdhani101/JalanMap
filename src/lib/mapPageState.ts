import type { DetailTab, SearchFocus } from '../types'

export type MapListMode = 'all' | 'hidden-camping' | 'hidden-cafe' | 'favorites'

export interface MapPageLocationState {
  selectedId?: string | null
  searchFocus?: SearchFocus | null
  pinFilter?: string
  detailTab?: DetailTab
  listMode?: MapListMode
  addMode?: boolean
}
