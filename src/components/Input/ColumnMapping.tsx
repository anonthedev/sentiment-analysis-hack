import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ColumnMapping = {
  originalName: string
  mappedType: string
}

type ColumnMappingFormProps = {
  onMappingComplete: (mapping: ColumnMapping[]) => void
}

const DATA_TYPES = [
  'customer_id',
  'product_id',
  'review_text',
  'rating',
  'date',
  'other'
]

export default function ColumnMappingForm({ onMappingComplete }: ColumnMappingFormProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>([{ originalName: '', mappedType: '' }])

  const addMapping = () => {
    setMappings([...mappings, { originalName: '', mappedType: '' }])
  }

  const updateMapping = (index: number, field: 'originalName' | 'mappedType', value: string) => {
    const newMappings = [...mappings]
    newMappings[index][field] = value
    setMappings(newMappings)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onMappingComplete(mappings.filter(m => m.originalName && m.mappedType))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Map CSV Columns</h3>
      {mappings.map((mapping, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor={`column-${index}`}>Column Name</Label>
            <Input
              id={`column-${index}`}
              value={mapping.originalName}
              onChange={(e) => updateMapping(index, 'originalName', e.target.value)}
              placeholder="Enter CSV column name"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor={`type-${index}`}>Data Type</Label>
            <Select
              value={mapping.mappedType}
              onValueChange={(value) => updateMapping(index, 'mappedType', value)}
            >
              <SelectTrigger id={`type-${index}`}>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addMapping}>
        Add Another Column
      </Button>
      <Button type="submit">
        Complete Mapping
      </Button>
    </form>
  )
}

