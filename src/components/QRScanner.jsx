import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const qrRef = useRef(null);
  const isRunning = useRef(false);

  useEffect(() => {
    const qr = new Html5Qrcode("qr-reader");
    qrRef.current = qr;

    const startScanner = async () => {
      try {
        await qr.start(
          { facingMode: "user" },
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            console.log("QR DETECTED:", decodedText);
            onScan(decodedText);
          }
        );

        isRunning.current = true;
      } catch (err) {
        console.error("QR start error:", err);
      }
    };

    startScanner();

    return () => {
      if (qrRef.current && isRunning.current) {
        qrRef.current.stop()
          .then(() => {
            qrRef.current.clear(); // ✅ THIS releases camera
          })
          .catch(() => {});

        isRunning.current = false;
      }
    };
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 400, margin: "auto" }}>
      <div
        id="qr-reader"
        style={{
          width: "100%",
          minHeight: "300px",
          border: "2px solid red"
        }}
      />
    </div>
  );
}