import { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Algebra Nation Bot",
  description:
    "A conversational AI designed to support students' math learning cognitively and socio-emotionally.",
  version: "1.0.0",
  action: { default_popup: "popup.html" },
  content_scripts: [
    {
      js: ["src/main.tsx"],
      matches: ["https://www.google.com/*", "https://web.algebranation.com/*"],
    },
  ],
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  permissions: ["storage", "cookies", "identity", "identity.email"],
  host_permissions: ["https://web.algebranation.com/*"],
  icons: {
    "48": "src/assets/logo@48.png",
    "128": "src/assets/logo@128.png",
  },
  oauth2: {
    client_id:
      "527461837254-dlhjaumomrjfhjc13inuhvj0i7bt7njt.apps.googleusercontent.com",
    scopes: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  },
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjG3o0jNJvgFVuVkkWjtgqx0bPMBUQx/zqhl+w6IGZCpr4e6a+y8+9jbz73eUSKzGa2rFZWMloexwbCf4owHyQIom4dUyWl2g8iafKEJBrgr4y2NxxZIAx7Qp52n2Fug6/QMJJivUnDIFteelwBIQIOV6zJ99UML7svPMX8klzRw0l4/sjhy8EyxO2umheEcsZELkqpFRxyxPalsPszvv/kbqnyYfEYHJj6IUa+mdAjZOMsSx/aC4xadohH2h+Q9lCvbnK25rG24rAZKG8wund1qxQgdhljl+65TIRmrGVAJ9xatjQ7PsgrOZqkoNtr0Dljk726SyvQFuzwbMd/nQfQIDAQAB",
};

export default manifest;
