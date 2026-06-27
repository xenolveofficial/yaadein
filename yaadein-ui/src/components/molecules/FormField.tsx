"use client"

import * as React from "react"
import { Controller, type Control } from "react-hook-form"
import { Input } from "@/components/atoms/Input"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  control: Control<any>
  label?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function FormField({
  name,
  control,
  label,
  hint,
  leftIcon,
  rightIcon,
  required,
  ...props
}: FormFieldProps) {
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
