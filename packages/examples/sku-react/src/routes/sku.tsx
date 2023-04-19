import { Button, Flex, Group, MultiSelect, TextInput } from '@mantine/core'
import SkuCreator, { PropertyValues } from '../../../../creator'
import { useState } from 'react'
const skuCreate = new SkuCreator()
const data1 = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
  { value: 'riot', label: 'Riot' },
  { value: 'next', label: 'Next.js' },
  { value: 'blitz', label: 'Blitz.js' }
]
export default function Sku() {
  const [propValues, setPropValues] = useState<PropertyValues[]>([])
  return (
    <Flex direction="column">
      <Flex direction="column">
        {propValues.map((prop, index) => {
          return (
            <Group key={index} mt="lg">
              <TextInput
                onChange={(e) => {
                  console.log(skuCreate.propertyHandlers.onChangeName(index, e.target.value))
                }}
                defaultValue={prop.name}
              />
              <MultiSelect
                onChange={(v) => {
                  console.log(
                    skuCreate.propertyHandlers.onChangeValues(
                      index,
                      v.map((t) => ({ text: t }))
                    )
                  )
                }}
                data={data1}
              />
            </Group>
          )
        })}
      </Flex>
      <Button
        onClick={() => {
          setPropValues(skuCreate.propertyHandlers.add().props)
        }}
      >
        添加
      </Button>
    </Flex>
  )
}
