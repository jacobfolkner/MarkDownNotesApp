import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { addDoc, doc, onSnapshot, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection , db} from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")

    
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

        // let [createdAt, setCreatedAt] = React.useState(Date.now());
        
        // let [updatedAt, setUpdatedAt] = React.useState(Date.now());

        React.useEffect(() => {
            currentNote ? setTempNoteText(currentNote.body) : setTempNoteText("")
        }, [currentNote])

        React.useEffect(() => {
            const timeoutId = setTimeout(() => {
                if (tempNoteText !== currentNote.body) {
                    updateNote(tempNoteText)
                }
            }, 500)
            return () => clearTimeout(timeoutId)
        }, [tempNoteText])

        const sortedNotes = notes.sort((a, b) => {
            return b.updatedAt - a.updatedAt
        })

    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
        // setCreatedAt(Date.now());
        // console.log(createdAt)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNote.id)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
        // setUpdatedAt(Date.now());
        // console.log(updatedAt)
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
