use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Box {
    pub creator: Pubkey,
    #[max_len(32)]
    pub ref_id: String,
    pub upvotes: u64,
    pub downvotes: u64,
    pub total_votes: i64,
    pub bump: u8
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VoteType {
    Upvote,
    Downvote
}

#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub has_voted: bool,
    pub vote_type: VoteType,
    pub bump: u8
}

impl Space for VoteRecord {
    const INIT_SPACE: usize = 32 + 1 + 2 + 1;
}