import {
  Box,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Text
} from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { Logo } from '@seivt/ui'

import { ThemeSelect } from '../../components/common/ThemeSelect'

export default function Welcome() {
  return (
    <Paper
      component={Flex}
      h="100vh"
      w="100vw"
      direction="column"
      justify="center"
      align="center"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'light'
            ? theme.colors.gray[1]
            : theme.colors.dark[8]
      })}
    >
      <Paper
        component={Flex}
        mih={365}
        withBorder
        radius="md"
        shadow="md"
        sx={(theme) => ({
          width: 585,
          [theme.fn.smallerThan('sm')]: {
            width: '90%'
          }
        })}
        style={{ overflow: 'hidden' }}
      >
        <Flex
          sx={({ colorScheme, colors, fn }) => ({
            backgroundColor:
              colorScheme === 'light' ? colors.gray[0] : colors.dark[6],
            borderRight: `1px solid ${
              colorScheme === 'dark' ? colors.dark[8] : colors.gray[2]
            }`,
            width: 255,
            [fn.smallerThan('sm')]: {
              width: 'auto'
            }
          })}
          direction="column"
          justify="space-between"
        >
          <Box p="xl">
            <Group>
              <Logo />

              <Text
                fz={14}
                fw={700}
                sx={(theme) => ({
                  [theme.fn.smallerThan('sm')]: {
                    display: 'none'
                  }
                })}
              >
                管理系统
              </Text>
            </Group>
          </Box>
          <SimpleGrid cols={1} p="lg" mb={3}>
            <ThemeSelect />
          </SimpleGrid>
        </Flex>
        <Outlet />
      </Paper>
    </Paper>
  )
}
