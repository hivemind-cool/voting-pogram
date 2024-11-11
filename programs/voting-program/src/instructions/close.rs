use anchor_lang::prelude::*;

use crate::state::Box;
use crate::VoteRecord;
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(ref_id: String)]
pub struct Close<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        close = creator,
        seeds = [b"box", ref_id.as_bytes().as_ref()],
        bump = box_.bump,
        constraint = box_.ref_id == ref_id @ ErrorCode::InvalidRefId
    )]
    pub box_: Account<'info, Box>,
}

impl <'info> Close<'info> {
    pub fn close_box(&mut self, ref_id: String, bump: u8) -> Result<()> {
        println!("Closing box with post_id: {}", self.box_.ref_id);
        Ok(())
    }
}