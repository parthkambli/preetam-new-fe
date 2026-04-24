import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          try {
            const parsed = JSON.parse(decodedText);

            if (!parsed.memberId) {
              alert("Invalid QR");
              return;
            }

            // 🔥 STOP scanner after success (IMPORTANT)
            scanner.stop();

            onScan(parsed.memberId);

          } catch {
            alert("Invalid QR format");
          }
        }
      )
      .catch((err) => console.error(err));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return <div id="reader" style={{ width: "300px" }} />;
}