import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  ConnectionConfig
} from "@solana/web3.js";
import {Program, AnchorProvider, Wallet, setProvider} from "@coral-xyz/anchor";
import idl from "./idl/voting_program.json";
import { VotingProgram } from "./types/voting_program";

const ENDPOINTS = {
  devnet: [
    "https://api.devnet.solana.com",
    "https://devnet.solana.com",
    "https://api.testnet.solana.com",
  ],
  mainnet: ["https://api.mainnet-beta.solana.com"],
  localnet: ["http://localhost:8899"],
};

const CONNECTION_CONFIG: ConnectionConfig = {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000,
  wsEndpoint: "",
  disableRetryOnRateLimit: false,
};

export class VotingProgramClient {
  private constructor(
    private program: Program<VotingProgram>,
    private connection: Connection,
    private wallet: Wallet,
    // private box
    public programId: PublicKey
  ) {}

  private static async tryConnection(endpoint: string): Promise<Connection | null> {
    try {
      const connection = new Connection(endpoint, CONNECTION_CONFIG);
      // Test the connection
      await connection.getLatestBlockhash();
      return connection;
    } catch (err) {
      console.log(`Failed to connect to ${endpoint}`);
      return null;
    }
  }

  static async init(
    walletKeyPair: Keypair,
    programId: string,
    env: "devnet" | "mainnet-beta" | "localnet" = "devnet"
  ): Promise<VotingProgramClient> {
    const endpoints = env === "mainnet-beta" ? ENDPOINTS.mainnet :
                     env === "localnet" ? ENDPOINTS.localnet :
                     ENDPOINTS.devnet;
    let connection: Connection | null = null;

    for (const endpoint of endpoints) {
      connection = await this.tryConnection(endpoint);
      if (connection) {
        console.log(`Connected to ${endpoint}`);
        break;
      }
    }

    if (!connection) {
      throw new Error("Failed to connect to any Solana endpoint");
    }

    const wallet = new Wallet(walletKeyPair);
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    });
    setProvider(provider);

    const programIdPubkey = new PublicKey(programId);

    const program = new Program(idl as VotingProgram, provider) as Program<VotingProgram>;

    return new VotingProgramClient(
      program,
      connection,
      wallet,
      programIdPubkey
    );
  }

  private async retry<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying operation... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retry(operation, retries - 1, delay * 1.5);
      }
      throw error;
    }
  }

  private async findBoxPDA(refId: string): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("box"), Buffer.from(refId)],
      this.programId
    );
  }

  private async findVoteRecordPDA(
    boxPDA: PublicKey,
    voterPubkey: PublicKey
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vote_record"), voterPubkey.toBuffer(), boxPDA.toBuffer()],
      this.programId
    );
  }

  async createBox(refId: string): Promise<string> {
    return this.retry(async () => {
      const [boxPDA, boxBump] = await this.findBoxPDA(refId);
      try {
        const accountParams = {
          creator: this.wallet.publicKey,
          box_: boxPDA,
          systemProgram: SystemProgram.programId
        } as any;
        const tx = await this.program.methods
          .initialize(refId, boxBump)
          .accounts(accountParams)
          .rpc();

        return tx;
      } catch (error) {
        console.error("Error creating box:", error);
        throw error;
      }
    });
  }

  async upvote(refId: string): Promise<string> {
    return this.retry(async () => {
      const [boxPDA, boxBump] = await this.findBoxPDA(refId);
      const [voteRecordPDA, _] = await this.findVoteRecordPDA(
        boxPDA,
        this.wallet.publicKey
      );

      // @ts-ignore
      const boxAccount = await this.program.account.box.fetch(boxPDA);

      try {
        const accountParams = {
          voter: this.wallet.publicKey,
          creator: boxAccount.creator,
          box_: boxPDA,
          voteRecord: voteRecordPDA,
          systemProgram: SystemProgram.programId
        } as any;
        const tx = await this.program.methods
          .upvote(refId, boxBump)
          .accounts(accountParams)
          .rpc();

        return tx;
      } catch (error) {
        console.error("Error upvoting:", error);
        throw error;
      }
    });
  }

  async downvote(refId: string): Promise<string> {
    return this.retry(async () => {
      const [boxPDA, boxBump] = await this.findBoxPDA(refId);
      const [voteRecordPDA, _] = await this.findVoteRecordPDA(
        boxPDA,
        this.wallet.publicKey
      );

      // @ts-ignore
      const boxAccount = await this.program.account.box.fetch(boxPDA);
      // @ts-ignore
      const voteRecordAccount = await this.program.account.voteRecord.fetch(
        voteRecordPDA
      );

      try {
        const accountParams = {
          voter: voteRecordAccount.voter,
          creator: boxAccount.creator,
          box_: boxPDA,
          voteRecord: voteRecordPDA,
          systemProgram: SystemProgram.programId
        } as any;
        const tx = await this.program.methods
          .downvote(refId, boxBump)
          .accounts(accountParams)
          .rpc();

        return tx;
      } catch (error) {
        console.error("Error downvoting:", error);
        throw error;
      }
    });
  }

  async closeVoteRecord(refId: string): Promise<string> {
    return this.retry(async () => {
      const [boxPDA, _b] = await this.findBoxPDA(refId);
      const [voteRecordPDA, _v] = await this.findVoteRecordPDA(
        boxPDA,
        this.wallet.publicKey
      );

      // @ts-ignore
      const boxAccount = await this.program.account.box.fetch(boxPDA);

      try {
        const accountParams = {
          voter: this.wallet.publicKey,
          creator: boxAccount.creator,
          box_: boxPDA,
          voteRecord: voteRecordPDA,
          systemProgram: SystemProgram.programId
        } as any;
        const tx = await this.program.methods
          // @ts-ignore
          .closeVoteRecord(refId)
          .accounts(accountParams)
          .rpc();

        return tx;
      } catch (error) {
        console.error("Error closing vote record:", error);
        throw error;
      }
    });
  }

  async closeBox(refId: string): Promise<string> {
    return this.retry(async () => {
      const [boxPDA, _] = await this.findBoxPDA(refId);

      // @ts-ignore
      const boxAccount = await this.program.account.box.fetch(boxPDA);

      try {
        const accountParams = {
          creator: boxAccount.creator,
          box_: boxPDA,
          systemProgram: SystemProgram.programId
        } as any;
        const tx = await this.program.methods
          // @ts-ignore
          .closeBox(refId)
          .accounts(accountParams)
          .rpc();

        return tx;
      } catch (error) {
        console.error("Error closing box:", error);
        throw error;
      }
    });
  }
}