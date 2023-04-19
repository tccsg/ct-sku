import { Avatar, Group, Navbar, Text } from '@mantine/core'
import { IconBrandLaravel } from '@tabler/icons-react'

import { NavLinks } from './NavLinks'
import { NavHeader } from '../../common/NavHeader'

import type { NavbarProps } from '@mantine/core'

interface HomeSidebarProps extends Omit<NavbarProps, 'children'> {}

export const HomeSidebar = ({ ...props }: HomeSidebarProps) => {
  return (
    <Navbar w={230} zIndex={9} {...props}>
      <Navbar.Section>
        <NavHeader>
          <Group pl="md">
            <Avatar size={33} color="blue" radius="md">
              <IconBrandLaravel size={18} />
            </Avatar>

            <Text fz={14} fw={700}>
              管理系统
            </Text>
          </Group>
        </NavHeader>
      </Navbar.Section>
      <Navbar.Section p="sm">
        <NavLinks />
      </Navbar.Section>
    </Navbar>
  )
}
