import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSunLow } from '@tabler/icons-react'

export const ThemeSelect = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <ActionIcon onClick={() => toggleColorScheme()}>
      {colorScheme === 'light'
        ? (
          <IconSunLow size={20} />
          )
        : (
          <IconMoon size={16} />
          )}
    </ActionIcon>
  )
}
