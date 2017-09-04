import { GOOGLE_TRANSLATE_VUEX_STATE, SAVE_STATE } from './types'

export const mutations = {
  [SAVE_STATE]: (state, payload) => localStorage.setItem(GOOGLE_TRANSLATE_VUEX_STATE, JSON.stringify(payload))
}

export default mutations
