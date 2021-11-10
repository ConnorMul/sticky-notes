import React, { useState } from 'react'

const StickyNoteForm = ({ notesState, note, addNote, setNote}) => {
    const [content, setContent] = useState("")
    const [arrayPosition, setArrayPosition] = useState(0)

    return (
        <form className="sticky-note-form" onSubmit={addNote}>
                <textarea placeholder="Create a new note..." 
                    value={note}
                    className="note-textarea"
                    onChange={event => setNote(event.target.value)}>
                </textarea>
                <button className="btn-submit">Add</button>
            </form>
    )
}

export default StickyNoteForm

