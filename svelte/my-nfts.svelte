<svelte:options tag="my-nfts" />

<script>
  import Metamask from "./kredeum-metamask.svelte";
  import { ethers } from "ethers";
  import { onMount } from "svelte";

  let signer = "";
  let address = "";

  const chain_ids = "0x89,0x13881";
  let chainId = 0;

  let owner = "0x981ab0D817710d8FFFC5693383C00D985A3BDa38";
  const subGraphUrl = "https://api.thegraph.com/subgraphs/name/zapaz/mumbai-open-nft";

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
    // const query = `{ tokens(id: 99) {id owner (where: {id:"${owner}"}) {id} tokenURI tokenJSON} }`;
    const query = `{ tokens(id: 99) {id owner {id} tokenURI tokenJSON} }`;
    const config = { method: "POST", body: JSON.stringify({ query }) };
    const answerGQL = (await fetchJson(subGraphUrl, config)).data;
    console.log("nft.listTheGraph query", query);
    console.log("nft.listTheGraph subgraphUrl", subGraphUrl);
    console.log("nft.listTheGraph answerGQL", answerGQL.tokens);

    const _tokens = [];
    answerGQL.tokens.forEach((tok, i) => {
      const _token = {};
      const [tokenId, contract] = tok.id.split(":");
      _token.tokenId = Number(tokenId).toString();
      _token.contract = contract;
      _token.ownerOf = tok.owner.id;
      _token.tokenURI = tok.tokenURI;
      _token.tokenJSONraw = tok.tokenJSON;
      _token.tokenJSON = JSON.parse(tok.tokenJSON);

      _tokens[i] = _token;
    });

    // console.log("nft.listTheGraph", tokens);
    return _tokens;
  }

  onMount(async function () {
    tokens = await listTheGraph();
    console.log("tokens", tokens);
  });
</script>

<main>
  {#each tokens as token}
    <p>
      {token.tokenId} - {token.contract}
      {token.tokenURI}
    </p>
    <img src="{token.tokenJSON.image}" alt="{token.tokenId}" height="300" />
    <pre>
      {token.tokenJSONraw} 
    </pre>
  {/each}
  <Metamask autoconnect="off" bind:address bind:chainId bind:signer chain_ids="{chain_ids}" />
</main>

<style>
</style>
