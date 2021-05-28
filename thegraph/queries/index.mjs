import fetch from "node-fetch";
import fs from "fs";

async function graphQL(url, query) {
  let response;
  try {
    response = await fetch(url, { 
      method: 'POST',
      body: JSON.stringify({query}),
      headers: { 'Content-Type': 'application/json' }
      });
  } catch (error) {
    console.error(error);
  }
  return response;
}

const queryFile = process.argv[2] || "contracts.gql";
const url = process.argv[3] || "https://api.thegraph.com/subgraphs/name/zapaz/eip721-mumbai";
const query = fs.readFileSync(queryFile, "utf8");

graphQL(url, query)
    .then(res => res.json())
    .then(json =>console.log(JSON.stringify(json, null,2)));
