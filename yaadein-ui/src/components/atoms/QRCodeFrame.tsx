"use client"

import * as React from "react"
import QRCode from "qrcode"
import { cn } from "@/lib/utils"

export interface QRCodeFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  size?: number
}

const QRCodeFrame = React.forwardRef<HTMLDivElement, QRCodeFrameProps>(
  ({ value, size = 200, className, ...props }, ref) => {
    const [qrDataUrl, setQrDataUrl] = React.useState<string>("")

    React.useEffect(() => {
      if (value) {
        QRCode.toDataURL(value, {
          width: size,
          margin: 1,
          color: {
            dark: "#1A1A2E", // text-primary
            light: "#FDFCFA", // surface-primary
          },
        })
          .then((url) => setQrDataUrl(url))
          .catch((err) => console.error("Error generating QR Code", err))
      }
    }, [value, size])

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center p-4 bg-surface-primary border border-border rounded-xl shadow-sm",
          className
        )}
        {...props}
      >
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR Code"
            width={size}
            height={size}
            className="rounded-md"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="bg-surface-secondary rounded-md animate-pulse"
          />
        )}
      </div>
    )
  }
)
QRCodeFrame.displayName = "QRCodeFrame"

export { QRCodeFrame }
