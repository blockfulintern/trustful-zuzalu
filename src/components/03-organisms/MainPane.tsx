// components/MainPane.tsx
import { type FC } from "react";

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { CreatedByBlockful } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";
import styles from "@/styles/mainPane.module.css";

const grotesk = Space_Grotesk({ subsets: ["latin"] });

export const MainPane: FC = () => {
  const { isConnected } = useAccount();
  const { isMobile } = useWindowSize();
  const { push } = useRouter();

  return (
    <Box className={styles.container}>
      <Flex>
        <Heading
          as="h2"
          className={`${grotesk.className} text-[53px] font-normal leading-[64px]`}
          color="#F5FFFF"
        >
          Online
          <br />
          reputation
          <br />
          made easy
        </Heading>
      </Flex>
      {isConnected && (
        <>
          <Box
            gap={6}
            display={"flex"}
            alignItems={"left"}
            justifyContent={"left"}
            flex={1}
            className="py-4"
          >
            <Button
              className="px-6 py-4 bg-[#B1EF42] text-black rounded-lg"
              _hover={{ bg: "#B1EF42" }}
              _active={{ bg: "#B1EF42" }}
              onClick={() => push("/my-badge")}
            >
              Go to dApp
            </Button>
          </Box>
        </>
      )}
      <Flex className={styles.content}>
        {!isConnected && isMobile && (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          style={{
                            background: "#B1EF42",
                            fontSize: "18px",
                            fontWeight: 500,
                            color: "#161617",
                            padding: "13px 28px 13px 28px",
                            borderRadius: "12px",
                            fontFamily: "Onest",
                            lineHeight: "normal",
                            fontStyle: "normal",
                          }}
                          onClick={openConnectModal}
                          type="button"
                        >
                          Connect
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} type="button">
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                        }}
                      >
                        <button
                          onClick={openChainModal}
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          type="button"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <Image
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button onClick={openAccountModal} type="button">
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        )}
      </Flex>
      <Flex className="bottom-[5%] absolute mt-auto">
        <CreatedByBlockful />
      </Flex>
    </Box>
  );
};
