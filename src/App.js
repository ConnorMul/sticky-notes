import React, { useState, useReducer, useRef, useEffect } from 'react'
import './App.css';
import StickyNoteForm from './components/StickyNoteForm'
import { v4 as uuid } from 'uuid';

const initalNoteState = {
  notes: []
}

const notesReducer = (previousState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case "ADD_NOTE": {
      const newNoteState = {
        notes: [...previousState.notes, action.payload]
      }

      return newNoteState
    }
    case "DELETE_NOTE": {
      const newNoteState = {
        ...previousState,
        notes: previousState.notes.filter(note => note.id !== action.payload.id)
      }
      return newNoteState
    }
    case "DELETE_ALL": {
      const newNoteState = {
        ...previousState,
        notes: []
      }
      return newNoteState
    }
  }
}

function App() {
  const [note, setNote] = useState("")
  const [notesState, dispatch] = useReducer(notesReducer, initalNoteState)
  const [isDrawing, setIsDrawing] = useState(false)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    const context = canvas.getContext("2d")
    context.scale(2, 2)
    context.lineCap = "round"
    context.strokeStyle ="black"
    context.lineWidth = 5
    contextRef.current = context
  }, [])

  const addNote = (e) => {
    e.preventDefault()

    if (!note) {
      return
    }

    const newNote = {
      id: uuid(),
      input: note,
      rotate: Math.floor(Math.random() * 20)
    }
    dispatch({ type: "ADD_NOTE", payload: newNote })
    setNote(" ")
  }


  const dropNote = (e) => {
    e.target.style.left = `${e.pageX - 50}px`
    e.target.style.top = `${e.pageY - 50}px`
  }

  const dragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const startDrawing = ({ nativeEvent }) => {
    const {offsetX, offsetY} = nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)

  }

  const finishDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return
    }
    const {offsetX, offsetY} = nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()

  }
  return (

      <div className="app-container" onDragOver={dragOver}>
        <h1>Sticky Notes</h1>
        <btn className="btn-delete-all" onClick={() => dispatch({ type: "DELETE_ALL", payload: note })}><div className="btn-text">NO MORE NOTES!!!!!</div></btn>

        <StickyNoteForm notes={notesState.notes} note={note} setNote={setNote} addNote={addNote}/>
          {notesState
            .notes.map(note => {
              return (
                <div className="sticky-note"
                key={note.id}
                style={{ transform: `rotate(${note.rotate}deg)` }}
                draggable
                onDragEnd={dropNote}
                >
                  <div className="sticky-delete" onClick={() => dispatch({ type: "DELETE_NOTE", payload: note })}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="sticky-note-text">
                    {note.input}
                  </div>
                </div>
              )
            })
          }
          <canvas onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} ref={canvasRef} /> 
      </div>
  );
}

export default App;
