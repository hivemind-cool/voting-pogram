use anchor_lang::prelude::*;

use crate::state::{Box, VoteRecord};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(_ref_id: String)]
pub struct CloseVoteRecord<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,

    /// CHECK: Creator account is just used for verification
    pub creator: AccountInfo<'info>,
    #[account(
        mut,
        has_one = creator @ ErrorCode::InvalidCreator,
        seeds = [b"box", _ref_id.as_bytes().as_ref()],
        bump = box_.bump,
        constraint = box_.ref_id == _ref_id @ ErrorCode::InvalidRefId
    )]
    pub box_: Account<'info, Box>,

    #[account(
        mut,
        close = voter,
        seeds = [
            b"vote_record",
            voter.key().as_ref(),
            box_.key().as_ref()
        ],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,

    pub system_program: Program<'info, System>,
}

impl <'info> CloseVoteRecord<'info> {
    pub fn vote_record_close(&mut self, _ref_id: String) -> Result<()> {
        println!("Closing vote record for box with post_id: {}", self.box_.ref_id);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_ref_id: String)]
pub struct CloseBox<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        close = creator,
        seeds = [b"box", _ref_id.as_bytes().as_ref()],
        bump = box_.bump,
        constraint = box_.ref_id == _ref_id @ ErrorCode::InvalidRefId,
        constraint = box_.creator == creator.key() @ ErrorCode::UnauthorizedClose
    )]
    pub box_: Account<'info, Box>,
    
    pub system_program: Program<'info, System>
}

impl <'info> CloseBox<'info> {
    pub fn box_close(&mut self, _ref_id: String) -> Result<()> {
        println!("Closing box with ref_id: {}", self.box_.ref_id);

        Ok(())
    }
}