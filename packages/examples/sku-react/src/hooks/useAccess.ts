import { useMemo } from 'react'
import Access from '@seivt/access'

import type { Policy, Rules } from '@seivt/access'

const adminPolicy: Policy = {
  action: ['account:*', 'answers:*', 'script:*', 'setting:*', 'case:*'],
  resource: {
    userId: '*',
    accountId: '*',
    answerId: '*'
  },
  role: 'superadmin'
}
const salesPolicy: Policy = {
  action: ['answers:list', 'answers:track', 'script:list', 'account:update'],
  resource: {
    userId: '',
    accountId: ''
  },
  role: 'sales'
}
const rules = {
  // 账户权限
  'account:get': ['userId', 'accountId'],
  'account:list': ['userId'],
  'account:add': ['userId'],
  'account:update': ['userId', 'accountId'],
  'account:delete': ['userId', 'accountId'],
  // 设置
  'setting:link:get': ['userId'],
  'setting:link:update': ['userId']
} as const

export default function useAccess() {
  const mockUser = {
    role: 'superadmin',
    userId: 'xxxx'
  }
  let currentPolicy = salesPolicy

  if (mockUser.role === 'superadmin') currentPolicy = adminPolicy

  if (mockUser.role === 'sales') {
    currentPolicy = salesPolicy
    currentPolicy.resource.userId = mockUser.userId
    currentPolicy.resource.accountId = mockUser.userId
  }

  type T = typeof rules

  const access = useMemo(
    () => new Access<keyof T, T>(currentPolicy, rules as unknown as Rules),
    []
  )
  const can = access.can.bind(access)

  return { can, currentPolicy }
}
