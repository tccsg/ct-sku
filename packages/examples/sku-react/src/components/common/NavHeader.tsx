import { Flex } from '@mantine/core'

import type { FC, PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {}

export const NavHeader: FC<Props> = ({ children }) => {
  return (
    <Flex
      h={50}
      sx={({ colors, colorScheme }) => ({
        flex: '0 0 auto',
        borderBottom: `1px solid ${
          colorScheme === 'light' ? colors.gray[2] : colors.dark[5]
        }`
      })}
    >
      {children}
    </Flex>
  )
}
