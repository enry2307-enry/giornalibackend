export type UserStatus = (
  'valid' | 
  'pending_email_verification' |
  'inactive' | 
  'penalty'
);

export type PublisherStatus = (
  'valid' | 
  'pending_submission' | 
  'pending_review' | 
  'invalid'| 
  'penalty'
);

export type PublisherType = (
  'newspaper' |
  'populizer'
);

export type CommentStatus = (
  'normal' |
  'edited' |
  'deleted'
);

export type PenaltyType = (
  'comment_ban' |
  'post_ban' |
  'scroll_video_ban' |
  'perma_ban'
);

export type UserVerificationStatus = (
  'pending' |
  'verified' |
  'rejected' |
  'password_reset'
);

export type PublisherVerificationStatus = (
  'pending' |
  'verified' |
  'rejected'
);