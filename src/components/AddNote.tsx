// src/components/AddNote.tsx
import React from 'react';
import styled from 'styled-components'; // Could also use a shared button style if needed

const AddNoteContainer = styled.div`
  /* Basic styling for the Add Note section */
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  color: #555;
`;

const AddNoteButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  &:hover {
    background-color: #5a55e0;
  }
`;

function AddNote() {
  const handleAddNote = () => {
    alert('Add Note feature coming soon!');
  };

  return (
    <AddNoteContainer>
      <h3>Add a New Note/Transaction</h3>
      <AddNoteButton onClick={handleAddNote}>
        Add Note
      </AddNoteButton>
    </AddNoteContainer>
  );
}

export default AddNote;