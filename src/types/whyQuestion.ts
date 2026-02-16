export interface WhyQuestion {
  id: string
  sectionId: string
  userId: string
  userName: string
  question: string
  createdAt: string
  likes: number
  likedBy: string[]
  answers: WhyAnswer[]
  tags: string[]  // e.g., ['실생활', '원리', '응용']
  isFeatured: boolean
}

export interface WhyAnswer {
  id: string
  questionId: string
  userId: string
  userName: string
  content: string
  createdAt: string
  likes: number
  likedBy: string[]
  isAccepted: boolean
}
