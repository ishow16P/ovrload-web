export const navLinks = [
  { to: '/', label: 'Home', auth: false },
  { to: '/exercises', label: 'Exercises', auth: false },
  { to: '/calories', label: 'Calories', auth: false },
  { to: '/programs', label: 'Programs', auth: true },
  { to: '/history', label: 'History', auth: true },
]

export function visibleLinks(loggedIn: boolean) {
  return navLinks.filter(l => loggedIn || !l.auth)
}

export function isNavActive(to: string, path: string) {
  return to === '/' ? path === '/' : path.startsWith(to)
}
