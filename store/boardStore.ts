import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupByColumn } from "@/lib/getTodosGroupByColumn";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: Image | null) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set, get) => ({
        board: {
          columns: new Map<TypedColumn, Column>(),
        },
        image: null,
        setImage: (image) => set({ image }),
        newTaskType: "todo",
        setNewTaskType: (newTaskType: TypedColumn) => set({ newTaskType }),
        searchString: "",
        newTaskInput: "",
        setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
        setSearchString: (searchString) => set({ searchString }),
        getBoard: async () => {
          const board = await getTodosGroupByColumn();
          set({ board });
        },
        deleteTask: async (taskIndex, todo, id) => {
          const newColumns = new Map(get().board.columns);
          newColumns.get(id)?.todos.splice(taskIndex, 1);
          set({ board: { columns: newColumns } });
          if (todo.image) {
            const img = JSON.parse(todo.image);
            await storage.deleteFile(img.bucketId, img.fileId);
          }
          await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
          );
        },
        addTask: async (
          todo: string,
          columnId: TypedColumn,
          image?: Image | null
        ) => {
          let file: Image | undefined;

          if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
              file = {
                bucketId: fileUploaded.bucketId,
                fileId: fileUploaded.$id,
              };
            }
          }

          const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
              title: todo,
              status: columnId,
              ...(file && { image: JSON.stringify(file) }),
            }
          );

          set({ newTaskInput: "" });

          set((state) => {
            const newColumns = new Map(state.board.columns);

            const newTodo: Todo = {
              $id,
              $createdAt: new Date().toISOString(),
              title: todo,
              status: columnId,
              ...(file && { image: file }),
            };

            const column = newColumns.get(columnId);

            if (!column) {
              newColumns.set(columnId, {
                id: columnId,
                todos: [newTodo],
              });
            } else {
              newColumns.get(columnId)?.todos.push(newTodo);
            }

            return {
              board: {
                columns: newColumns,
              },
            };
          });
        },

        setBoardState: (board) => set({ board }),
        updateTodoInDB: async (todo, columnId) => {
          await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
              title: todo.title,
              status: columnId,
            }
          );
        },
      }),
      {
        name: "board-storage",
      }
    )
  )
);

export default useBoardStore;
