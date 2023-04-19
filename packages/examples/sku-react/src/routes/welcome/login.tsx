import {
  Box,
  Button,
  Flex,
  Group,
  PasswordInput,
  TextInput,
  Title
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'

export default function Login() {
  const form = useForm({
    initialValues: {
      account: '',
      passwd: ''
    },
    validate: {
      account: isNotEmpty(),
      passwd: isNotEmpty()
    }
  })

  return (
    <Flex direction="column" w="100%" p="xl">
      <Title order={3}>登录</Title>
      <form onSubmit={form.onSubmit((values) => {})}>
        <TextInput
          label="账号"
          {...form.getInputProps('account')}
          mt="sm"
          placeholder="输入登录账号"
        />
        <PasswordInput
          label="密码"
          {...form.getInputProps('passwd')}
          mt="sm"
          placeholder="输入密码"
        />
        <Group position="apart" mt="lg">
          <Box />
          <Button w={120} type="submit">
            登录
          </Button>
        </Group>
      </form>
    </Flex>
  )
}
