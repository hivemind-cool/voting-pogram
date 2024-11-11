use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The user has already voted.")]
    AlreadyVoted,
    #[msg("The ref_id does not match with ref_id of the box")]
    InvalidRefId
}