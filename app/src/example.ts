import { Keypair } from "@solana/web3.js";
import { VotingProgramClient } from "./client";
import { keypair } from "./keypair.json";

async function main() {
  try {
    const wallet = Keypair.fromSecretKey(Uint8Array.from(Object.values(keypair)));
    const programId = "J9zEWRH1AeggcKxuXHMTuwDn1RSUXuNK3DdrPMvFTZbq";
    const client = await VotingProgramClient.init(wallet, programId, "devnet");

    // Create a new box
    const refId = "test-post-10";
    console.log("Creating box...");
    const createTx = await client.createBox(refId);
    console.log("Box created with tx:", createTx);

    // Cast an upvote
    console.log("Casting upvote...");
    const voteTx = await client.upvote(refId);
    console.log("Upvote cast with tx:", voteTx);

    // Close vote record
    console.log("Closing vote record...");
    const closeTx = await client.closeVoteRecord(refId);
    console.log("Vote record closed with tx:", closeTx);

    // Close box
    console.log("Closing box...");
    const closeBoxTx = await client.closeBox(refId);
    console.log("Box closed with tx:", closeBoxTx);

  } catch (error) {
    console.error("Error:", error);
  }
}

main();