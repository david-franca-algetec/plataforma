import { useColorMode } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";

export function Logo() {
  const { colorMode } = useColorMode();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  if (colorMode === "light") {
    return <Image src={`${baseUrl}/images/logo.png`} alt="Logo" width="200px" />;
  }
  return <Image src={`${baseUrl}/images/logo-branca.png`} alt="Logo" width="200px" />;
}
