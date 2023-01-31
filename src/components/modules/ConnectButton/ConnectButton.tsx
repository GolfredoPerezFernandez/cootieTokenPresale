import { signOut, useSession } from 'next-auth/react';

import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';

import { getEllipsisTxt } from 'utils/format';

import { Typography } from '@web3uikit/core';

import { Image } from '@chakra-ui/react';

import { useMoralis } from 'react-moralis';

import { useEffect, useState } from 'react';

const ConnectButton = () => {
  const toast = useToast();
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const { Moralis, authenticate, enableWeb3, isWeb3EnableLoading, isWeb3Enabled, logout, user } = useMoralis();

  useEffect(() => {
    async function init() {
      await enableWeb3();
    }
    if (!isWeb3Enabled) {
      setLoading(true);
      
      init();
    } else {
      setLoading(false);
    }
  }, [isWeb3Enabled]);
  const handleAuth = async () => {
    setLoading(true);
    console.log('entro');
    try {
      console.log('entro');
      await enableWeb3();
      const chainId = Moralis.getChainId();

      const chainId2 = 14;
      const chainName = 'Flare Mainnet';
      const currencyName = 'FLR';
      const currencySymbol = 'FLR';
      const rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
      const blockExplorerUrl = 'https://songbird-explorer.flare.network/';

      if ( chainId === '0x13'||chainId === '0xe') {
        await authenticate({
          signingMessage: 'Welcome to TheCooties DAO.',
        });
      } else {
        await Moralis.addNetwork(chainId2, chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);

      toast({
        title: 'Oops, something is wrong...',
        description: (e as { message: string })?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleDisconnect = async () => {
    await logout();
    signOut({ callbackUrl: '/' });
  };

  if (user) {
    return (
      <HStack onClick={handleDisconnect} cursor={'pointer'}>
        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(user.get('ethAddress'))}</Text>
      </HStack>
    );
  }

  if (data?.user) {
    return (
      <HStack onClick={handleDisconnect} cursor={'pointer'}>
        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(data.user.address)}</Text>
      </HStack>
    );
  }

  return (
    <Button width={'200px'} backgroundColor={'#1CFFA0T'} disabled={loading && isWeb3EnableLoading} onClick={handleAuth} color="#F45EAC">
     <HStack>  <Image
      src={'https://bafybeig3u2v3deghowo5df3ig5lydo6enb35awmtb5pt5ymv7zsy64enta.ipfs.w3s.link/MetaMask_Fox.svg.png'}
     
      height={'20px'}
      width={"20px"}
      alt="Ultimate"
    /> <Typography color={'white'}>Metamask </Typography></HStack> 
    </Button>
  );
};

export default ConnectButton;
