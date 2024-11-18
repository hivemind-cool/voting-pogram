use anchor_lang::prelude::*;

use crate::state::Box;

use crate::constants::DISCRIMINATOR;
use crate::VoteRecord;
use crate::state::VoteType::{Upvote, Downvote};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(_ref_id: String)]
pub struct Vote<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,

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
        init,
        payer = voter,
        space = DISCRIMINATOR + VoteRecord::INIT_SPACE,
        seeds = [
            b"vote_record",
            voter.key().as_ref(),
            box_.key().as_ref()
        ],
        bump,
    )]
    pub vote_record: Account<'info, VoteRecord>,

    pub system_program: Program<'info, System>,
}

impl <'info> Vote<'info> {
    pub fn upvote(&mut self, _ref_id: String, bump: u8) -> Result<()> {
        if self.vote_record.has_voted {
            return Err(ErrorCode::AlreadyVoted.into());
        }

        self.vote_record.set_inner(VoteRecord {
            voter: self.voter.key(),
            has_voted: true,
            vote_type: Upvote,
            bump
        });

        self.box_.upvotes += 1;
        self.box_.total_votes += 1;

        Ok(())
    }

    pub fn downvote(&mut self, _ref_id: String, bump: u8) -> Result<()> {
        if self.vote_record.has_voted {
            return Err(ErrorCode::AlreadyVoted.into());
        }

        self.vote_record.set_inner(VoteRecord {
            voter: self.voter.key(),
            has_voted: true,
            vote_type: Downvote,
            bump
        });

        self.box_.downvotes += 1;
        self.box_.total_votes -= 1;

        Ok(())
    }
}