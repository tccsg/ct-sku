import { NavLink } from '@mantine/core'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import type { FC } from 'react'

const links = [
  {
    label: 'xxxx',
    url: '/home/xxx'
  }
]
interface NavLinksProps {
  onNavLinkClick?: () => void
}

export const NavLinks: FC<NavLinksProps> = ({ onNavLinkClick }) => {
  const { pathname } = useLocation()

  return (
    <>
      {links.map((link) => {
        return (
          <NavLink
            key={link.url}
            onClick={onNavLinkClick}
            label={link.label}
            to={link.url}
            active={link.url === pathname}
            component={RouterLink}
          />
        )
      })}
    </>
  )
}
