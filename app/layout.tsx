import React, { ReactNode } from "react";
import Providers from "app/Providers";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <html>
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
