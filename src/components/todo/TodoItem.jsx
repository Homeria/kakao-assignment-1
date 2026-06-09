import { useState } from 'react'
import { TodoEditItem } from './TodoEditItem'
import { TodoViewItem } from './TodoViewItem'

// 개별 Todo 한 줄을 담당하는 컴포넌트입니다.
// 수정 모드와 수정 중인 입력값은 해당 TodoItem 내부에서만 필요한 UI 상태이므로 여기서 관리합니다.
export function TodoItem({ todo, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(todo.text)
    const [errorMessage, setErrorMessage] = useState('')

    function startEdit() {
        setEditText(todo.text)
        setErrorMessage('')
        setIsEditing(true)
    }

    function changeEditText(nextEditText) {
        setEditText(nextEditText)
        setErrorMessage('')
    }

    function cancelEdit() {
        setEditText(todo.text)
        setErrorMessage('')
        setIsEditing(false)
    }

    function saveEdit() {
        const trimmedText = editText.trim()

        if (!trimmedText) {
            setErrorMessage('수정할 내용을 입력해 주세요.')
            return
        }

        onUpdateTodo(todo.id, trimmedText)
        setIsEditing(false)
        setErrorMessage('')
    }

    function handleEditKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            saveEdit()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            cancelEdit()
        }
    }

    if (isEditing) {
        return (
            <TodoEditItem
                editText={editText}
                errorMessage={errorMessage}
                onChangeEditText={changeEditText}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditKeyDown={handleEditKeyDown}
            />
        )
    }

    return (
        <TodoViewItem
            todo={todo}
            onToggleTodo={onToggleTodo}
            onStartEdit={startEdit}
            onDeleteTodo={onDeleteTodo}
        />
    )
}
