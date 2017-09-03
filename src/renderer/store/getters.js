import { GOOGLE_TRANSLATE_VUEX_STATE } from './types'

const state = state => JSON.parse(localStorage.getItem(GOOGLE_TRANSLATE_VUEX_STATE)) || state
export default { state }
