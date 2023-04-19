import {
  Avatar,
  Box,
  Burger,
  Flex,
  Group,
  MediaQuery,
  Menu,
  Paper,
  Transition,
  createStyles,
  rem
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet, useNavigate } from 'react-router-dom'

import { NavHeader } from '../components/common/NavHeader'
import { ThemeSelect } from '../components/common/ThemeSelect'
import { HomeSidebar } from '../components/home/HomeSidebar'
import { NavLinks } from '../components/home/HomeSidebar/NavLinks'
import { openAlertDialog } from '../components/modals/alertDialog'

const useStyles = createStyles((theme) => ({
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 99,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },
  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  }
}))

export default function Home() {
  const [opened, { toggle, close }] = useDisclosure(false)
  const { classes } = useStyles()
  const navigate = useNavigate()

  const confirmSignOut = () => {
    openAlertDialog({
      title: '是否退出登录？',
      buttons: [
        {
          type: 'cancel',
          label: '取消'
        },
        {
          label: '确认退出',
          onClick: (close) => {
            navigate('/login')
            close()
          }
        }
      ]
    })
  }

  return (
    <Flex h="100vh">
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <HomeSidebar />
      </MediaQuery>

      <Flex direction="column" h="100vh" sx={{ overflow: 'hidden', flex: 1 }}>
        <NavHeader>
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            pl="sm"
            sx={(theme) => ({
              paddingRight: theme.spacing.xl,
              [theme.fn.smallerThan('sm')]: {
                paddingRight: theme.spacing.sm
              }
            })}
          >
            <div>
              <Burger
                opened={opened}
                onClick={toggle}
                className={classes.burger}
                size="sm"
              />
              <Transition
                transition="pop-top-right"
                duration={200}
                mounted={opened}
              >
                {(styles) => (
                  <Paper className={classes.dropdown} withBorder style={styles}>
                    <NavLinks onNavLinkClick={() => close()} />
                  </Paper>
                )}
              </Transition>
            </div>
            <Group>
              <ThemeSelect />

              <Menu trigger="hover" width={130} shadow="sm">
                <Menu.Target>
                  <Avatar src={null} alt="no image here" radius="xl" />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>管理员</Menu.Label>
                  <Menu.Divider />
                  <Menu.Item>用户设置</Menu.Item>
                  <Menu.Item onClick={confirmSignOut}>退出登录</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Flex>
        </NavHeader>
        <Flex w="100%" direction="column" sx={{ flex: 1, overflow: 'hidden' }}>
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  )
}
