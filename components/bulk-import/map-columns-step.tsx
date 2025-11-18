'use client'
import { ArrowRight, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { type CanonicalKey, optionalKeys, requiredKeys } from './steps'

interface MapColumnsStepProps {
  headers: string[]
  mapping: Record<CanonicalKey, string>
  updateMapping: (key: CanonicalKey, value: string) => void
  onContinue: () => void
  onReset: () => void
}

export function MapColumnsStep({
  headers,
  mapping,
  updateMapping,
  onContinue,
  onReset,
}: MapColumnsStepProps) {
  const canonicalFields: { key: CanonicalKey; required: boolean }[] = [
    ...requiredKeys.map((k) => ({ key: k, required: true })),
    ...optionalKeys.map((k) => ({ key: k, required: false })),
  ]
  const allRequiredMapped = requiredKeys.every((k) => mapping[k])

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Map Header Columns</h3>
        <p className="text-xs text-muted-foreground">
          Match each system field to a column in your import file. Required
          fields are marked with *.
        </p>
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Column Headers</TableHead>
              <TableHead className="w-6 p-0"></TableHead>
              <TableHead>Column Headers in Import File</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {canonicalFields.map(({ key, required }) => {
              const missingRequired = required && !mapping[key]
              return (
                <TableRow
                  key={key}
                  className={cn('text-sm', missingRequired && 'bg-red-50/50')}
                >
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-1">
                      <span className="capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      {required && <span className="text-destructive">*</span>}
                    </div>
                  </TableCell>
                  <TableCell className="w-6 p-0 text-center align-middle">
                    <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            value={mapping[key] || undefined}
                            onValueChange={(val) =>
                              updateMapping(key, val === '__NONE__' ? '' : val)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                'w-full justify-between h-8 text-xs md:text-sm',
                                missingRequired &&
                                  'border-destructive/50 focus-visible:border-destructive',
                              )}
                            >
                              <SelectValue
                                placeholder={
                                  required
                                    ? 'Select column...'
                                    : "Don't map this field"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {!required && (
                                <SelectItem value="__NONE__">
                                  Don&apos;t map this field
                                </SelectItem>
                              )}
                              {headers.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Search className="h-4 w-4 text-muted-foreground opacity-60" />
                      </div>
                      {!required && mapping[key] && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateMapping(key, '')}
                          className="h-7 text-xs"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs">
          <span className="font-medium">Required mapped:</span>{' '}
          {requiredKeys.filter((k) => mapping[k]).length}/{requiredKeys.length}
          {!allRequiredMapped && (
            <span className="ml-2 text-destructive">
              (Please map all required fields)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            Reset
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!allRequiredMapped}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
