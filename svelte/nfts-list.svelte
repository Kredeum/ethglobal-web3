<svelte:options tag="nfts-list" />

<script>
  import Metamask from "./kredeum-metamask.svelte";
  import { ethers } from "ethers";
  import { onMount } from "svelte";

  let signer = "";
  let address = "";

  const chain_ids = "0x89,0x13881";
  let chainId = 0;

  let owner = "0x981ab0D817710d8FFFC5693383C00D985A3BDa38";
  // const subGraphUrl = "https://api.thegraph.com/subgraphs/name/zapaz/mumbai-open-nft";
  // const subGraphUrl = "https://api.thegraph.com/subgraphs/name/zapaz/eip721-mumbai";
  const subGraphUrl = "https://api.thegraph.com/subgraphs/id/QmPsb5SD69bRSCb6uyUiLAFXrFmqiGbMUS1jEQwMWTY45s";
  let tokens = [];

  async function fetchJson(tokenURI, config = {}) {
    let json = {};
    try {
      json = await (await fetch(tokenURI, config)).json();
    } catch (e) {
      console.error("MyNfts.fetchJson ERROR", tokenURI, e);
    }
    return json;
  }

  async function listTheGraph() {
    // const query = `{ tokens(first: 99) {id owner (where: {id:"${owner}"}) {id} tokenURI metadata} }`;
    // const query = `{ tokens(where: { metadata_not: "" }) {id owner {id} tokenURI metadata} }`;
    const query = `
    { 
      tokens(first:99, where: { metadata_not: "" }) {
        id 
        owner {id} 
        tokenURI 
        name 
        description 
        image  
        metadata
      } 
    }
    `;
    const config = { method: "POST", body: JSON.stringify({ query }) };
    const answerGQL = (await fetchJson(subGraphUrl, config)).data;
    console.log("nft.listTheGraph query", query);
    console.log("nft.listTheGraph subgraphUrl", subGraphUrl);
    console.log("nft.listTheGraph answerGQL", answerGQL.tokens);

    // console.log("nft.listTheGraph", tokens);
    return answerGQL.tokens;
  }

  onMount(async function () {
    tokens = await listTheGraph();
    console.log("tokens", tokens);
  });
</script>

<main>
  {#each tokens as token}
    <p>
      {token.id} -{token.name} - {token.desscription}
    </p>
    <img src="{token.image}" alt="{token.name}" height="300" />
    <pre>
      {token.metadata} 
    </pre>
  {/each}
  <Metamask autoconnect="off" bind:address bind:chainId bind:signer chain_ids="{chain_ids}" />
</main>

<style>
</style>
