declare module 'qrcode' {
  const QRCode: {
    toBuffer: (text: string, options?: any) => Promise<Buffer>;
    toDataURL: (text: string, options?: any) => Promise<string>;
    toFile: (path: string, text: string, options?: any) => Promise<void>;
    // Add more as needed
  };

  export default QRCode;
}
