import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";
import { VotingProgram } from "../target/types/voting_program";

describe("voting-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VotingProgram as Program<VotingProgram>;

  const refId: string = "test";
  let boxPDA: PublicKey;
  let voteRecordPDA: PublicKey;
  let boxBump: number;

  before(async () => {
    const [boxAddress, bBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("box"), Buffer.from(refId)],
      program.programId
    );
    boxPDA = boxAddress;
    boxBump = bBump;

    const [voteRecordAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vote_record"),
        provider.wallet.publicKey.toBuffer(),
        boxPDA.toBuffer(),
      ],
      program.programId
    );
    voteRecordPDA = voteRecordAddress;
  });

  it("Initialization test", async () => {
    try {
      const tx = await program.methods
        .initialize(refId, boxBump)
        .accounts({
          box_: boxPDA,
          creator: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Box created! Transaction signature:", tx);

      // Fetch the created account
      const boxAccount = await program.account.box.fetch(boxPDA);

      assert.equal(
        boxAccount.creator.toBase58(),
        provider.wallet.publicKey.toBase58()
      );
      assert.equal(boxAccount.refId, refId);
      assert.equal(boxAccount.totalVotes.toNumber(), 0);
      assert.equal(boxAccount.bump, boxBump);
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  });

  it("Vote test", async () => {
    try {
      const tx = await program.methods
        .upvote(refId, boxBump)
        .accounts({
          voter: provider.wallet.publicKey,
          creator: provider.wallet.publicKey,
          box_: boxPDA,
          voteRecord: voteRecordPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([provider.wallet.payer])
        .rpc();
      const voteRecord = await program.account.voteRecord.fetch(voteRecordPDA);
      assert.equal(voteRecord.hasVoted, true, "Vote not recorded");
      assert.deepEqual(
        voteRecord.voteType,
        { upvote: {} },
        "Wrong vote type recorded"
      );

      const boxAccount = await program.account.box.fetch(boxPDA);
      assert.equal(
        boxAccount.totalVotes.toNumber(),
        1,
        "Vote count not incremented"
      );

      console.log("Upvote recorded successfully with signature:", tx);
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  });

  it("VoteRecord close", async () => {
    try {
      const tx = await program.methods
        .closeVoteRecord(refId)
        .accounts({
          voter: provider.wallet.publicKey,
          creator: provider.wallet.publicKey,
          box_: boxPDA,
          voteRecord: voteRecordPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([provider.wallet.payer])
        .rpc();

      console.log("VoteRecord closed successfully with signature:", tx);

      try {
        await program.account.voteRecord.fetch(voteRecordPDA);
        assert.fail("VoteRecord should not exist after closure");
      } catch (err) {
        assert.include(
          err.toString(),
          "Account does not exist",
          "VoteRecord account still exists after closure"
        );
      }
    } catch (err) {
      console.error("Error closing vote record:", err);
      throw err;
    }
  });

  it("Box close", async () => {
    try {
      const tx = await program.methods
        .closeBox(refId)
        .accounts({
          creator: provider.wallet.publicKey,
          box_: boxPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([provider.wallet.payer])
        .rpc();

      console.log("Box closed successfully with signature:", tx);

      try {
        await program.account.box.fetch(boxPDA);
        assert.fail("Box should not exist after closure");
      } catch (err) {
        assert.include(
          err.toString(),
          "Account does not exist",
          "Box account still exists after closure"
        );
      }
    } catch (err) {
      console.error("Error closing box:", err);
      throw err;
    }
  });
});
