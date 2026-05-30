export const PRO_STORAGE_KEY = 'facetype_pro_unlocked'

export function isProUnlocked() {
  try {
    return localStorage.getItem(PRO_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function setProUnlocked() {
  try {
    localStorage.setItem(PRO_STORAGE_KEY, 'true')
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearProUnlocked() {
  try {
    localStorage.removeItem(PRO_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
