<svelte:options tag="kredeum-metamask" />

<script>
  import { ethers } from "ethers";
  import detectEthereumProvider from "@metamask/detect-provider";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import networks from "../config/networks.json";

  const dispatch = createEventDispatcher();

  export let signer;
  export let address;
  export let chainId;
  export let autoconnect;
  export let chain_ids;

  let network;
  let connectmetamask = "Connect to Metamask";

  let targetChain = false;

  async function addEthereumChain(_chainId) {
    if (targetChain) {
      //console.log('already connecting network...');
    }
    targetChain = true;

    if (_chainId !== "0x1") {
      // no need to add default ethereum chain

      const _network = networks.find((nw) => Number(nw.chainId) === Number(_chainId));
      if (_network) {
        for (const field in _network) {
          // IEP-3085 fields only or fails
          if (!["chainId", "blockExplorerUrls", "chainName", "iconUrls", "nativeCurrency", "rpcUrls"].includes(field)) {
            delete _network[field];
          }
        }
        // add new chain to metamask
        ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [_network]
          })
          .then(() => {
            network = _network;
          })
          .catch((e) => console.error("ERROR wallet_addEthereumChain", e));
      }
    }
  }

  async function handleChainId(_chainId) {
    if (_chainId) {
      // _chainId not null
      if (_chainId != chainId) {
        // _chainId changed

        // transform chain_ids list to chainIds array : "0x89,0x13881" => ["0x89","0x13881"]
        const chainIds = chain_ids?.split(",");
        //console.log("handleChainId <=", _chainId, chainIds);

        if (chainIds && !chainIds.find((id) => Number(id) === Number(_chainId))) {
          // _chainId not accepted : add first accepted chainId
          addEthereumChain(chainIds[0]);
        } else {
          chainId = _chainId;
          network = networks.find((nw) => Number(nw.chainId) === Number(_chainId));
        }
      }
    }
  }

  async function handleAccounts(_accounts) {
    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      address = _accounts[0];
      signer = new ethers.providers.Web3Provider(ethereum).getSigner(0);
      dispatch("address", { address: address });
    }
  }
  async function connectMetamask() {
    //console.log('connectMetamask');

    ethereum
      .request({
        method: "eth_requestAccounts"
      })
      .then(handleAccounts)
      .catch((e) => {
        if (e.code === 4001) {
          alert("Please connect to MetaMask.");
        } else {
          //console.error('ERROR eth_requestAccounts', e);
        }
      });
  }
  onMount(async function () {
    //console.log('init');
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        alert("Do you have multiple wallets installed?");
      }

      ethereum
        .request({
          method: "eth_accounts"
        })
        .then(handleAccounts)
        .catch((e) => console.error("ERROR eth_accounts", e));

      ethereum
        .request({
          method: "eth_chainId"
        })
        .then(handleChainId)
        .catch((e) => console.error("ERROR eth_chainId", e));

      ethereum.on("chainChanged", handleChainId);

      ethereum.on("accountsChanged", handleAccounts);
    } else {
      //console.log('Please install MetaMask!');
      connectmetamask = "Please install MetaMask chrome extension to connect your blockchain address to your site";
    }
  });
</script>

{#if address}
  {#if network}
    <a href="{network?.blockExplorerUrls[0]}/address/{address}/tokens" target="_blank">{network?.chainName}@{address}</a
    >
  {:else}
    {network?.chainName}@{address}
  {/if}
{:else}
  <button on:click="{connectMetamask}">{connectmetamask}</button>
{/if}
