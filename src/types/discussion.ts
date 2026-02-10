export interface Discussion {
  id: string
  sectionId: string
  userId: string
  userName: string
  content: string
  createdAt: string
  likes: number
  likedBy: string[] // User IDs who liked this discussion
  replies: Reply[]
}

export interface Reply {
  id: string
  discussionId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}
