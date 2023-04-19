import { Flex } from '@mantine/core'

import type { FC, PropsWithChildren } from 'react'

export const HomeToolbar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      w="100%"
      align="center"
      pl="sm"
      sx={({ colorScheme, colors }) => ({
        flex: '0 0 40px',
        borderBottom: `1px solid ${
          colorScheme === 'light' ? colors.gray[2] : colors.dark[5]
        }`
      })}
    >
      {children}
    </Flex>
  )
}
