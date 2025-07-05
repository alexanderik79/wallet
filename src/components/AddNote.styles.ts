// src/components/AddNote.styles.ts
import styled from 'styled-components';

export const AddNoteContainer = styled.div`
  /* Restoring max-width for a "portrait" layout that accommodates two columns */
  max-width: 480px; 
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  color: #333;
  margin-left: auto; /* Center the form */
  margin-right: auto; /* Center the form */
`;

export const AddNoteButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 12px;
  /* To center the button if its width is not 100% */
  display: block; 
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: #5a55e0;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 12px;
  text-align: left;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
`;

export const Input = styled.input`
  width: 100%; /* Ensures it takes up all available width */
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.9em;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 0 1px rgba(108, 99, 255, 0.2);
  }
`;

export const Select = styled.select`
  width: 100%; /* Ensures it takes up all available width */
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.9em;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236c63ff%22%20d%3D%22M287%2C146.2L146.2%2C0L5.4%2C146.2h281.6z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 0 1px rgba(108, 99, 255, 0.2);
  }
`;

export const ToggleButtonGroup = styled.div`
  display: flex;
  width: 100%; /* Takes up full available width of its parent */
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #ddd;
  background-color: #e9e9e9;

  /* margin-bottom is handled by the parent container, so removed here */
`;

export const ToggleButtonLabel = styled.label`
  flex: 1;
  padding: 8px 5px;
  text-align: center;
  cursor: pointer;
  background-color: #f2f2f2;
  color: #555;
  font-weight: 500;
  font-size: 0.9em;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  position: relative;

  ${Input}[type="radio"]:checked + & {
    background-color: #6c63ff;
    color: white;
    font-weight: 600;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.06);
  }

  &:first-of-type {
    border-right: 1px solid #ddd;
  }

  &:hover {
    background-color: #e0e0e0;
  }

  ${Input}[type="radio"]:checked + &:hover {
    background-color: #5a55e0;
  }
`;

export const HiddenRadioInput = styled(Input)`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

export const ErrorMessage = styled.p`
  color: #d9534f;
  font-weight: 500;
  margin-top: 3px;
  margin-bottom: 0;
  text-align: left;
  font-size: 0.75em;
`;

/* New styled component for grouping top fields */
export const TopFieldsContainer = styled.div`
  display: flex; /* Use flexbox for horizontal layout */
  gap: 15px; /* Space between columns */
  margin-bottom: 12px; /* Space below this block */
  align-items: flex-start; /* Align items to the top */

  /* Container for 'Amount' and 'Category' fields */
  & > div:first-child { 
    flex: 2; /* Gives it more space */
    display: flex;
    flex-direction: column;
    gap: 12px; /* Space between Amount and Category */
  }

  /* Container for 'Type' toggle switch */
  & > div:last-child { 
    flex: 1; /* Gives it less space, as it's already compact */
    display: flex;
    flex-direction: column;
    /* Remove margin-bottom from ToggleButtonGroup to avoid extra space */
    ${ToggleButtonGroup} {
        margin-bottom: 0;
    }
  }
`;