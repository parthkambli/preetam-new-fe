// import { useEffect, useRef } from "react";
// import { Html5Qrcode } from "html5-qrcode";

// export default function QRScanner({ onScan }) {
//   const qrRef = useRef(null);
//   const isRunning = useRef(false);

//   useEffect(() => {
//     const qr = new Html5Qrcode("qr-reader");
//     qrRef.current = qr;

//     const startScanner = async () => {
//       try {
//         await qr.start(
//           { facingMode: "user" },
//           {
//             fps: 10,
//             qrbox: 250,
//           },
//           (decodedText) => {
//             console.log("QR DETECTED:", decodedText);
//             onScan(decodedText);
//           }
//         );

//         isRunning.current = true;
//       } catch (err) {
//         console.error("QR start error:", err);
//       }
//     };

//     startScanner();

//     return () => {
//       if (qrRef.current && isRunning.current) {
//         qrRef.current.stop()
//           .then(() => {
//             qrRef.current.clear(); // ✅ THIS releases camera
//           })
//           .catch(() => {});

//         isRunning.current = false;
//       }
//     };
//   }, []);

//   return (
//     <div style={{ width: "100%", maxWidth: 400, margin: "auto" }}>
//       <div
//         id="qr-reader"
//         style={{
//           width: "100%",
//           minHeight: "300px",
//           border: "2px solid red"
//         }}
//       />
//     </div>
//   );
// }


import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const qrRef = useRef(null);
  const isRunning = useRef(false);
  const containerId = useRef(`qr-reader-${Date.now()}`); // ✅ unique id
  const hasScanned = useRef(false);
  (decodedText) => {
  if (hasScanned.current) return;

  hasScanned.current = true;

  console.log("QR DETECTED:", decodedText);
  onScan(decodedText);
}
  useEffect(() => {
    let qr;

    const startScanner = async () => {
      try {
        // 🔥 prevent duplicate instance
        if (qrRef.current) return;

        qr = new Html5Qrcode(containerId.current);
        qrRef.current = qr;

        await qr.start(
          { facingMode: "environment" }, // ✅ back camera (better UX)
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            if (!decodedText) return;

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
      const stopScanner = async () => {
        try {
          if (qrRef.current && isRunning.current) {
            await qrRef.current.stop();
            await qrRef.current.clear();

            qrRef.current = null;
            isRunning.current = false;
          }
        } catch (err) {
          console.error("QR stop error:", err);
        }
      };

      stopScanner(); // 🔥 properly handled async cleanup
    };
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 400, margin: "auto" }}>
      <div
        id={containerId.current} // ✅ unique per instance
        style={{
          width: "100%",
          minHeight: "300px",
          border: "2px solid red"
        }}
      />
    </div>
  );
}