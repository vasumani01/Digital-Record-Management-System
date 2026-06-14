import { supabase } from '@/lib/supabase'
import type { Document } from '@/types'

export const documentService = {
  async getDocuments(ownerId?: string): Promise<Document[]> {
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (ownerId) {
      query = query.eq('owner_id', ownerId)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Document[]
  },

  async getDocumentById(id: string): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Document
  },

  async deleteDocument(id: string, filePath: string): Promise<void> {
    // 1. Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    // 2. Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath])

    if (storageError) {
      console.warn('Storage file deletion failed or file did not exist:', storageError.message)
    }
  }
}
