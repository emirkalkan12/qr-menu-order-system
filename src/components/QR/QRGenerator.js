import React from 'react';
import { Card, Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';

const QRGenerator = ({ tableNumber, url }) => {
  const downloadQR = () => {
    const canvas = document.getElementById('qr-code');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `table-${tableNumber}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Card className="text-center shadow-sm">
      <Card.Body>
        <Card.Title>Table {tableNumber}</Card.Title>
        <div className="my-4">
          <QRCode
            id="qr-code"
            value={url}
            size={200}
            level={'H'}
            includeMargin={true}
          />
        </div>
        <Button variant="primary" onClick={downloadQR}>
          Download QR Code
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QRGenerator;
