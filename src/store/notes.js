export default {
  state: {
    notes: [],
    editableNote: null,
  },
  getters: {
    notes: (state) => state.notes,
    noteById: (state) => (id) => state.notes.find((note) => note.id === id),
    editableNote: (state) => state.editableNote,
  },
  mutations: {
    setNotes(state, payload) {
      state.notes = payload;
    },
    createNote(state, payload) {
      state.notes.push(payload);
    },
    deleteNote(state, payload) {
      state.notes = state.notes.filter((note) => note.id !== payload);
    },
    updateNote(state, payload) {
      state.notes = state.notes.map((note) =>
        note.id === payload.id ? payload : note
      );
    },
    setEditableNote(state, payload) {
      state.editableNote = payload;
    },
    resetEditableNote(state) {
      state.editableNote = null;
    },
  },
  actions: {
    fetchNotes({ commit }) {
      commit("setNotes", JSON.parse(localStorage.getItem("notes") || "[]"));
    },
    createNote({ commit, getters }, payload) {
      commit("createNote", payload);
      localStorage.setItem("notes", JSON.stringify(getters.notes));
    },
    deleteNote({ commit, getters }, payload) {
      commit("deleteNote", payload);
      localStorage.setItem("notes", JSON.stringify(getters.notes));
    },
    updateNote({ commit, getters }, payload) {
      commit("updateNote", payload);
      localStorage.setItem("notes", JSON.stringify(getters.notes));
    },
  },
};
