import "/styles/globals.css";

import React, { ReactNode } from "react";
import Providers from "app/Providers";
import DesktopNavBar from "app/NavBar";

export default async ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <body>
        <Providers>
          <DesktopNavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
};
