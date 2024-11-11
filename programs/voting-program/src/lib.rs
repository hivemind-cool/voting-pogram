pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("23vsX5uS5S4J4oLLQcepH9sFCyCAcFXBYQXUtnqr1Vur");

#[program]
pub mod voting_program {
    use super::*;

    pub fn initialize(ctx: Context<Create>, ref_id: String, bump: u8) -> Result<()> {
        ctx.accounts.create_new_box(ref_id, bump)?;
        Ok(())
    }

    pub fn upvote(ctx: Context<Vote>, ref_id: String, bump: u8) -> Result<()> {
        ctx.accounts.upvote(ref_id, bump)?;
        Ok(())
    }

    pub fn downvote(ctx: Context<Vote>, ref_id: String, bump: u8) -> Result<()> {
        ctx.accounts.downvote(ref_id, bump)?;
        Ok(())
    }

    pub fn close(ctx: Context<Close>, ref_id: String, bump: u8) -> Result<()> {
        ctx.accounts.close_box(ref_id, bump)?;
        Ok(())
    }
}
