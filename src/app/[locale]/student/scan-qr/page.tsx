import QrScannerClient from "@/components/qr-scanner-client";
import { Separator } from "@/components/ui/separator";

export default function ScanQrPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Mark Your Attendance
                </h1>
                <p className="text-muted-foreground">
                    Scan the QR code provided by your teacher to mark your attendance.
                </p>
            </div>
            <Separator />
            <QrScannerClient />
        </div>
    );
}
