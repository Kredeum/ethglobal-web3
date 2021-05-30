<svelte:options tag="nfts-list" />

<script>
  import Metamask from "./kredeum-metamask.svelte";
  import { ethers } from "ethers";
  import { onMount } from "svelte";

  let signer = "";
  let address = "";

  const chain_ids = "0x89,0x13881";
  let chainId = 0;
  let tokens = [];

  let owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
  const subGraphUrl = "https://api.thegraph.com/subgraphs/name/zapaz/eip721-mumbai";

  async function fetchJson(tokenURI, config = {}) {
    let json = {};
    try {
      json = await (await fetch(tokenURI, config)).json();
    } catch (e) {
      console.error("MyNfts.fetchJson ERROR", tokenURI, e);
    }
    return json;
  }

  async function listTheGraph(_address) {
    // const query = `{ tokens(first: 99) {id owner (where: {id:"${owner}"}) {id} tokenURI metadata} }`;
    // const query = `{ tokens(where: { metadata_not: "" }) {id owner {id} tokenURI metadata} }`;
    // owner(id: "0x981ab0d817710d8fffc5693383c00d985a3bda38")
    const query = `
    {
        tokens(first:99 where:{metadata_not:""}) {
          id
          tokenURI 
          name 
          description 
          image  
          metadata
        } 
    } 
    `;
    console.log("listTheGraph subgraphUrl", subGraphUrl);
    console.log("listTheGraph query", query);

    const answerGQL = await fetchJson(subGraphUrl, { method: "POST", body: JSON.stringify({ query }) });
    console.log("listTheGraph answerGQL", answerGQL);

    return answerGQL?.data?.tokens || [];
  }

  onMount(async function () {
    tokens = await listTheGraph(owner);
    console.log("tokens", tokens);
  });
</script>

<main>
  {#each tokens as token}
    <img src="{token.image}" alt="{token.name}" height="50" />
    <pre>
      {JSON.stringify(JSON.parse(token.metadata), null, 2)} 
    </pre>
  {/each}
  <Metamask autoconnect="off" bind:address bind:chainId bind:signer chain_ids="{chain_ids}" />
</main>

<style>
</style>
