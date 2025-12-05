"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, AlertCircle } from "lucide-react"
import type { RiskComment } from "@/lib/types"

interface RiskCommentsProps {
  riskId: string
  onCommentAdded?: (comment: RiskComment) => void
}

export function RiskComments({ riskId, onCommentAdded }: RiskCommentsProps) {
  const [comments, setComments] = useState<RiskComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar comentarios
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("📥 Fetching comments for risk:", riskId)
        const res = await fetch(`/api/risks/${riskId}/comments`)
        if (!res.ok) throw new Error("Error fetching comments")
        const data = await res.json()
        console.log("✅ Comments loaded:", data.length, "comments")
        setComments(data)
        setError(null)
      } catch (err) {
        console.error("❌ Error fetching comments:", err)
        setError("No se pudieron cargar los comentarios")
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
    
    // Recargar comentarios cada 10 segundos para reflejar cambios
    const interval = setInterval(fetchComments, 10000)
    return () => clearInterval(interval)
  }, [riskId])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      console.log("📤 Posting comment:", newComment)
      const res = await fetch(`/api/risks/${riskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: newComment,
          user_id: "current-user", // TODO: obtener del auth
        }),
      })

      if (!res.ok) throw new Error("Error creating comment")
      const created = await res.json()
      console.log("✅ Comment created:", created)
      setComments((prev) => [created, ...prev])
      setNewComment("")
      
      if (onCommentAdded) {
        onCommentAdded(created)
      }
    } catch (err) {
      console.error("❌ Error adding comment:", err)
      setError("No se pudo crear el comentario")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      console.log("🗑️ Deleting comment:", commentId)
      const res = await fetch(`/api/risks/${riskId}/comments?commentId=${commentId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error deleting comment")
      console.log("✅ Comment deleted")
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      setError(null)
    } catch (err) {
      console.error("❌ Error deleting comment:", err)
      setError("No se pudo eliminar el comentario")
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📝 Comentarios y Cambios</h3>

      {/* Input para nuevo comentario */}
      <div className="flex gap-2">
        <Input
          placeholder="Agregar comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !submitting) {
              handleAddComment()
            }
          }}
          disabled={submitting}
        />
        <Button onClick={handleAddComment} disabled={submitting || !newComment.trim()} size="sm">
          {submitting ? "..." : "Enviar"}
        </Button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto border rounded-lg p-3 bg-muted/30">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">⏳ Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">📭 Sin comentarios aún</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-3 bg-background/50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {comment.user_id === "system" ? "🤖 Sistema" : comment.user_id}
                  </p>
                  <p className="text-sm mt-1 break-words">{comment.comment}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(comment.created_at).toLocaleString("es-ES")}
                  </p>
                </div>
                {comment.user_id !== "system" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex-shrink-0 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
