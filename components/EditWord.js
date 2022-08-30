function EditWord({ word, setWord, definition, setDefinition, fulldefinition, setFullDefinition, updateWord }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        updateWord();
    }
    return (
        <div className="edit-word">
            <form onSubmit={handleSubmit}>
                <input type="text" name="word" placeholder="Word" value={word} onChange={(e) => setWord(e.target.value)} required />
                <textarea type="text" name="definition" placeholder="Definition" value={definition} onChange={(e) => setDefinition(e.target.value)} />
                <textarea type="text" name="fulldefinition" placeholder="Full definition" value={fulldefinition} onChange={(e) => setFullDefinition(e.target.value)} />
                <button type="submit">Save</button>
            </form>
            <style jsx>{`
                .edit-word {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                input {
                    width: 100%;
                    height: 40px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    padding: 0 10px;
                    outline: none;
                }
                textarea {
                    width: 100%;
                    height: 80px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    padding: 5px;
                    outline: none;
                }
                input:focus, textarea:focus {
                    border: 1px solid #000;
                }
                button {
                    width: 100%;
                    height: 40px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    padding: 0 10px;
                    cursor: pointer;
                    background-color: #007bff;
                }
            `}</style>
        </div>
    )
}

export default EditWord;