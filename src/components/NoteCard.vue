<template>
  <v-card>
    <v-card-title>{{ note.name }}</v-card-title>
    <v-list>
      <v-list-item
        class="d-flex align-center"
        dense
        v-for="todo in todos"
        :key="todo.id"
      >
        <v-checkbox
          class="ma-0 pa-0"
          v-model="todo.active"
          disabled
          hide-details
          dense
          color="primary"
        ></v-checkbox>
        <span class="ml-1">{{ todo.name }}</span>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-actions class="justify-end">
      <v-btn text color="error" @click="noteToDelete(note.id)">Delete</v-btn>
      <v-btn class="ml-5" color="success" @click="editNote(note.id)"
        >Edit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "NoteCard",
  props: {
    note: Object,
  },
  data: () => ({
    visibleTodos: 3,
  }),
  methods: {
    editNote(id) {
      this.$store.commit("setEditableNote", id);
      this.$router.push("/note");
    },
    noteToDelete(id) {
      this.$emit("noteToDelete", id);
    },
  },
  computed: {
    todos() {
      return this.note.todos.slice(0, this.visibleTodos);
    },
  },
};
</script>
