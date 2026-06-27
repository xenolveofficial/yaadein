"use client"

import * as React from "react"
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form"
import { Input } from "@/components/atoms/Input"
import { cn } from "@/lib/utils"

export interface FormFieldProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>
  control: Control<T>
  label?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  hint,
  leftIcon,
  rightIcon,
  required,
  ...props
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...props}
          label={label}
          hint={hint}
          error={fieldState.error?.message}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          required={required}
        />
      )}
    />
  )
}
