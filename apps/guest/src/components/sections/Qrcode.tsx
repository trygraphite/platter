import { QrCodeIcon } from "@platter/ui/lib/icons";

export function QrCodeSection() {
  return (
    <div className="mt-16 p-8 bg-muted/50 rounded-lg max-w-md mx-auto">
      <div className="flex items-center justify-center gap-4 text-muted-foreground">
        <QrCodeIcon className="w-8 h-8" />
        <p className="text-lg">Scan QR code to get started</p>
      </div>
    </div>
  );
}