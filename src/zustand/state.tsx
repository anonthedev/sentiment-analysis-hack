import { create } from 'zustand'
 /* eslint-disable @typescript-eslint/no-explicit-any */
export const useReviewData = create((set)=>({
    reviewData: null,
    updateReviewData: (_reviewData: any) => set({reviewData: _reviewData})
}))