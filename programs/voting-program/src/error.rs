use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The creator of the box is invalid")]
    InvalidCreator,
    #[msg("The user has already voted.")]
    AlreadyVoted,
    #[msg("The ref_id does not match with ref_id of the box")]
    InvalidRefId,
    #[msg("The user is not authorized to close the box")]
    UnauthorizedClose
}