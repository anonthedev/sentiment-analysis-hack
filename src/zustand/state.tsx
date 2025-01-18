import { create } from 'zustand'

export const useReviewData = create((set)=>({
    reviewData: null,
    updateReviewData: (_reviewData: any) => set({reviewData: _reviewData})
}))