<template>
  <v-card max-width="600" class="mx-auto">
    <v-container>
      <div class="v-row">
        <v-col cols="12" class="d-flex justify-end mb-3">
          <v-btn color="primary" @click="$router.push('/note')"
            >Create note</v-btn
          >
        </v-col>
      </div>
      <v-row>
        <template v-if="notesList.length">
          <v-col
            cols="12"
            class="notes-list"
            v-for="note in notesList"
            :key="note.id"
          >
            <NoteCard :note="note" @noteToDelete="handleDeleteNote($event)" />
          </v-col>
        </template>
        <v-col v-else cols="12" class="text-center">
          <p>No notes yet...</p>
        </v-col>
      </v-row>
    </v-container>
    <ConfirmPopup
      :dialog="deleteDialog"
      @close="closeDialog"
      @confirm="confirmDialog"
    />
  </v-card>
</template>

<script>
import NoteCard from "@/components/NoteCard";
import ConfirmPopup from "@/components/ConfirmPopup";

export default {
  name: "Name",
  components: {
    NoteCard,
    ConfirmPopup,
  },
  data: () => ({
    deleteDialog: false,
    noteToDelete: null,
  }),
  created() {
    this.$store.dispatch("fetchNotes");
  },
  methods: {
    handleDeleteNote(id) {
      this.deleteDialog = true;
      this.noteToDelete = id;
    },
    closeDialog() {
      this.deleteDialog = false;
      this.noteToDelete = null;
    },
    confirmDialog() {
      this.$store.dispatch("deleteNote", this.noteToDelete);
      this.deleteDialog = false;
    },
  },
  computed: {
    notesList() {
      return this.$store.getters.notes;
    },
  },
};
</script>
