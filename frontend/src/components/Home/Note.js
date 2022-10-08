import "./Note.css";
import SearchLocationInput from "./SearchLocationInput";
const Note = () => {
  const submitNoteHandler = (event) => {
    event.preventDefault();
    const formData = {
      title: event.target.noteTitle.value,
      address: event.target.noteAddress.value,
      content: event.target.noteContent.value,
    };
    console.log(formData);
  };

  return (
    <div id="noteForm" class="container">
      <form onSubmit={submitNoteHandler}>
        <div class="form-group">
          <label for="noteTitle">Add a title</label>
          <input
            class="form-control text-input"
            type="text"
            id="noteTitle"
            placeholder="Enter a title"
            required
          />
        </div>
        <div class="form-group">
          <label for="address">Ping a location</label>
          <SearchLocationInput
            id="noteAddress"
            class="form-control text-input"
          />
        </div>
        <div class="form-group">
          <label for="noteContent">Content</label>
          <textarea
            name="noteContent"
            id="noteContent"
            cols="20"
            rows="3"
            class="form-control"
            required
          ></textarea>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <button type="submit" class="btn btn-success noteBtn">
            <i class="fas fa-check"></i>
          </button>
          <button type="button" class="btn btn-danger noteBtn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Note;
