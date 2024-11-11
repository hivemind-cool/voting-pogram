use anchor_lang::prelude::*;

use crate::state::Box;

use crate::constants::DISCRIMINATOR;

#[derive(Accounts)]
#[instruction(ref_id: String)]
pub struct Create<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = DISCRIMINATOR + Box::INIT_SPACE,
        seeds = [b"box", ref_id.as_bytes().as_ref()],
        bump
    )]
    pub box_: Account<'info, Box>,

    pub system_program: Program<'info, System>,
}

impl <'info> Create<'info> {
    pub fn create_new_box(&mut self, ref_id: String, bump: u8) -> Result<()> {
        self.box_.set_inner(Box {
            creator: self.creator.key(),
            ref_id,
            upvotes: 0,
            downvotes: 0,
            total_votes: 0,
            bump
        });
        Ok(())
    }
}