import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "jp.liver_analytics.app",
  appName: "LiverAnalytics",
  webDir: "out",
  server: {
    androidScheme: "https",
    cleartext: false,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: "apksigner",
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0b0f1a",
      showSpinner: false,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0b0f1a",
    },
  },
};

export default config;
