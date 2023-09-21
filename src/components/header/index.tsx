import {
  Avatar,
  Box,
  BoxProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/chakra-ui";
import { useGetIdentity, useGetLocale } from "@refinedev/core";
import { IconLanguage, IconMoon, IconSun } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IUser } from "../../../pages/api/login";

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { data: user } = useGetIdentity<IUser>();

  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("refine.header.bg.light", "refine.header.bg.dark");

  const locale = useGetLocale();
  const currentLocale = locale();
  const { locales } = useRouter();

  let stickyProps: BoxProps = {};
  if (sticky) {
    stickyProps = {
      position: "sticky",
      top: 0,
      zIndex: 1,
    };
  }

  const getInitials = (name: string) => {
    const initials = name.toUpperCase().split(" ");
    if (initials.length === 1) {
      return initials[0][0];
    }
    if (initials.length > 1) {
      return `${initials[0].charAt(0)}${initials.pop()?.charAt(0)}`;
    }
    return name.toUpperCase().charAt(0);
  };

  return (
    <Box
      py="2"
      pr="4"
      pl="2"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      w="full"
      height="64px"
      bg={bgColor}
      borderBottom="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      {...stickyProps}
    >
      <HamburgerMenu />

      <HStack>
        <Menu>
          <MenuButton as={IconButton} aria-label="Options" icon={<IconLanguage />} variant="ghost" />
          <MenuList>
            {[...(locales ?? [])].sort().map((lang: string) => (
              <MenuItem
                key={lang}
                as={Link}
                href="/"
                locale={lang}
                color={lang === currentLocale ? "green" : undefined}
                icon={<Avatar src={`/images/flags/${lang}.svg`} h={18} w={18} />}
              >
                {lang === "en" ? "English" : "Português"}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <IconButton variant="ghost" aria-label="Toggle theme" onClick={toggleColorMode}>
          <Icon as={colorMode === "light" ? IconMoon : IconSun} w="24px" h="24px" />
        </IconButton>

        {user?.name && (
          <HStack>
            {user?.name && (
              <Text size="sm" fontWeight="bold">
                {user.name}
              </Text>
            )}
            <Avatar size="sm" name={user?.name} src={getInitials(user?.name)} />
          </HStack>
        )}
      </HStack>
    </Box>
  );
};
