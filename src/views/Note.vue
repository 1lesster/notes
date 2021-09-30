<template>
  <v-card max-width="600" class="mx-auto pt-10 px-10">
    <v-card-title class="justify-space-between">
      <h3>{{ `${pageTitle} note` }}</h3>
      <v-icon v-if="editStatus" color="error" @click="deleteNote">
        mdi-delete
      </v-icon>
    </v-card-title>
    <v-form v-model="valid" @submit.prevent="submitHandler">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model.lazy="note.name"
              class="mb-5"
              label="Note name"
              dense
              outlined
              required
              :rules="inputRule"
            ></v-text-field>
            <v-list v-if="note.todos.length">
              <v-list-item
                class="d-flex align-center px-0"
                v-for="todo in note.todos"
                :key="todo.id"
              >
                <v-checkbox
                  class="ma-0 pa-0"
                  v-model.lazy="todo.active"
                  hide-details
                  color="primary"
                ></v-checkbox>
                <v-text-field
                  class="ml-5"
                  dense
                  label="Todo name"
                  v-model="todo.name"
                  required
                  :rules="inputRule"
                ></v-text-field>
                <v-list-item-icon>
                  <v-icon @click="deleteTodo(todo.id)"> mdi-close </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
            <v-alert v-else dense outlined type="warning">
              At least one todo is required
            </v-alert>
            <div class="d-flex justify-center">
              <v-btn small color="primary" @click="addTodo">add todo</v-btn>
            </div>
            <v-card-actions class="mt-10 justify-space-between">
              <div v-if="editStatus" class="d-flex justify-start">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      outlined
                      fab
                      small
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      class="mr-3"
                      :disabled="!isUndoBtnDisabled"
                      @click="undoHistory"
                    >
                      <v-icon>mdi-arrow-u-left-top</v-icon>
                    </v-btn>
                  </template>
                  <span>Undo</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      outlined
                      fab
                      small
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      class="mr-3"
                      :disabled="!isRedoBtnDisabled"
                      @click="redoHistory"
                    >
                      <v-icon>mdi-arrow-u-right-top</v-icon>
                    </v-btn>
                  </template>
                  <span>Redo</span>
                </v-tooltip>
              </div>
              <v-spacer v-else></v-spacer>
              <div class="d-flex justify-end">
                <v-btn text color="error" class="mr-3" @click="cancel"
                  >Cancel</v-btn
                >
                <v-btn
                  :disabled="!isSaveBtnDisabled"
                  type="submit"
                  class="success"
                  >Save</v-btn
                >
              </div>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <ConfirmPopup
      :title="confirmPopupTitle"
      :dialog="dialog"
      @close="closeDialog"
      @confirm="confirmDialog"
    />
  </v-card>
</template>

<script>
import ConfirmPopup from "@/components/ConfirmPopup";
import _ from "lodash";

export default {
  name: "Note",
  components: {
    ConfirmPopup,
  },
  data: () => ({
    dialog: false,
    cancelDialog: false,
    valid: false,
    inputRule: [(v) => !!v.trim() || "Field is required"],
    editHistory: [],
    historyIndex: 0,
    skipHistory: false,
    note: {
      id: new Date().getTime(),
      name: "",
      todos: [
        {
          id: new Date().getTime(),
          name: "",
          active: false,
        },
      ],
    },
    defaultNote: {
      id: new Date().getTime(),
      name: "",
      todos: [
        {
          id: new Date().getTime(),
          name: "",
          active: false,
        },
      ],
    },
  }),
  watch: {
    noteCopy: {
      deep: true,
      handler: _.debounce(function (val) {

        if (!this.editStatus) {
            return;
        }

        if (this.skipHistory) {
          this.skipHistory = false;
          return;
        }

        if (!this.editHistory.length) {
          this.editHistory.push({ ...val });
          return;
        }

        this.editHistory.push({ ...val });
        this.historyIndex++;
      }, 300),
    },
  },
  created() {
    if (this.editStatus) {
      this.note = this.$store.getters.noteById(
        this.$store.getters.editableNote
      );
    }
  },
  destroyed() {
    this.historyIndex = [];
  },
  methods: {
    undoHistory() {
      if (!this.historyIndex) {
        return;
      }

      this.skipHistory = true;
      this.note = { ...this.editHistory[this.historyIndex - 1] };
      this.historyIndex--;
    },
    redoHistory() {
      if (this.historyIndex === this.editHistory.length) {
        return;
      }

      this.skipHistory = true;
      this.note = { ...this.editHistory[this.historyIndex + 1] };
      this.historyIndex++;
    },
    addTodo() {
      this.note.todos.push({
        id: new Date().getTime(),
        name: "",
        active: false,
      });
    },
    deleteTodo(id) {
      this.note.todos = this.note.todos.filter((todo) => todo.id !== id);
    },
    deleteNote() {
      this.dialog = true;
    },
    submitHandler() {
      if (!this.editStatus) {
        this.$store.dispatch("createNote", {
          ...this.note,
          id: new Date().getTime(),
        });
      } else {
        this.$store.dispatch("updateNote", this.note);
        this.$store.commit("resetEditableNote");
      }
      this.$router.push("/");
    },
    closeDialog() {
      this.dialog = false;
      this.cancelDialog = false;
    },
    confirmDialog() {
      if (this.cancelDialog) {
        this.note = Object.assign({}, this.defaultNote);
        this.cancelDialog = false;
      } else {
        this.$store.dispatch("deleteNote", this.note.id);
      }
      this.$store.commit("resetEditableNote");
      this.dialog = false;
      this.$router.push("/");
    },
    cancel() {
      if (!this.editStatus) {
        this.$router.push("/");
      } else {
        this.cancelDialog = true;
        this.dialog = true;
      }
    },
  },
  computed: {
    noteCopy: function () {
      return Object.assign({}, _.cloneDeep(this.note));
    },
    editStatus() {
      return !!this.$store.getters.editableNote;
    },
    pageTitle() {
      return this.$store.getters.editableNote ? "Edit" : "Create";
    },
    confirmPopupTitle() {
      return this.cancelDialog
        ? "Are you sure you want to cancel editing?"
        : "Are you sure you want to delete this note?";
    },
    isSaveBtnDisabled() {
      return this.valid && this.note.todos.length;
    },
    isUndoBtnDisabled() {
      return this.historyIndex > 0 && this.editHistory.length > 0;
    },
    isRedoBtnDisabled() {
      return this.historyIndex < this.editHistory.length - 1;
    },
  },
};
</script>
